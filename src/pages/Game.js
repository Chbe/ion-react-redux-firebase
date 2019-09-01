import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withHandlers } from 'recompose';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/game/drag-n-drop/LetterBox';
import Keyboard from '../components/game/drag-n-drop/Keyboard';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonProgressBar, IonIcon, IonButton, IonContent, IonModal, IonAlert } from '@ionic/react';
import styled from 'styled-components';
import { FlexboxCenter, MaxWidthContent } from '../components/UI/DivUI';
import { setEnablePlay, setLettersArray, inGameCleanUp } from '../store/actions';
import { rewind, glasses, eye, send } from 'ionicons/icons';
import { isPlatform } from '@ionic/react'; // TODO: Should it be core or react????
import { withFirestore } from 'react-redux-firebase';
import { wordsApiKey } from '../config/Configs';

const Wrapper = styled(FlexboxCenter)`
    height: 90vh;
    justify-content: space-between;
    flex-direction: column;
`

const ActionsWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding: 1em;
`;

const Button = styled(IonButton)`
    transition: background-color .2s ease-in;
`;

export class Game extends Component {
    _dndBackend = isPlatform('desktop')
        ? HTML5Backend
        : TouchBackend;
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            game: {},
            timeLeft: 25,
            progressbarValue: 0,
            buffer: 0,
            progressbarColor: 'primary',
            showResultAlert: false,
            resultsAlertData: {
                header: '',
                subHeader: '',
                message: '',
                buttons: []
            }
        };
    }

    UNSAFE_componentWillMount() {
        this._isMounted = true;
        if (!this.props.games || !this.props.match.params.gameId) {
            this.props.history.push('/');
        } else {
            this.initialize();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.cleanUp();
    }

    initialize = () => {
        const gameId = this.props.match.params.gameId;
        const game = this.props.games.find(game => game.id === gameId);
        this.safeStateUpdate({ game, gameId });
        this.props.setLettersArray(game.letters);
        this.prepareForGameStart(game);
    }

    safeStateUpdate = (val) => {
        if (this._isMounted)
            this.setState(val);
    }

    prepareForGameStart = (game) => {
        const length = game.letters ?
            game.letters.length : 0;

        const timeout = (!!length ?
            (500 + (1200 * length)) : 800);

        let buffer = 0;
        this.bufferInterval = setInterval(() => {
            if (buffer < 1) {
                buffer += 0.01;
                this.safeStateUpdate({ buffer })
            }
            else {
                this.props.setEnablePlay(true);
                clearInterval(this.bufferInterval);
            }
        }, (timeout / 100));

        this.startGameTimer = setTimeout(() => {
            this.startTimer();
            this.startPogressbarTimer(0);
            this.safeStateUpdate({ progressbarColor: 'success' });
        }, timeout);
    }

    startTimer = () => {
        this.startInterval = setInterval(() => {
            const timeLeft = this.state.timeLeft - 1;
            this.safeStateUpdate({ timeLeft })
            if (timeLeft === 0) {
                // TODO: Prepare Result alert
                this.finishRound();
            }
        }, 1000);
    }

    startPogressbarTimer = (progressbarValue) => {
        this.progressbarTimer = setInterval(() => {
            if (progressbarValue < 1) {
                progressbarValue += 0.001;
                this.safeStateUpdate({ progressbarValue });

                if (progressbarValue > .5 && progressbarValue < .85)
                    this.safeStateUpdate({ progressbarColor: 'warning' });
                else if (progressbarValue >= .85)
                    this.safeStateUpdate({ progressbarColor: 'danger' });

            }
            else {
                clearInterval(this.progressbarTimer);
            }
        }, (25000 / 1000));
    }

    getClosestActivePlayer = (getPreviousPlayer = false) => {
        // Remove scores
        const players = [...this.state.game.players]
            .map(({ uid, isActive }) => { return { uid, isActive } });

        /**
         * Defining a start index for our loop since
         * we want to get the "next player in line" 
         * FROM current player
         */
        const startIndex = players.findIndex(p => p.uid === this.props.uid)
        const playersLength = players.length;

        const innerLoopFunc = (i) => {
            const playerInd = (i + startIndex) % playersLength;
            const player = players[playerInd];
            if (player.uid !== this.props.uid && player.isActive) {
                return player.uid;
            }
        }

        if (getPreviousPlayer) {
            for (let i = players.length; i > 0; i--) {
                const player = innerLoopFunc(i);
                if (player)
                    return player;
            }
        } else {
            for (let i = 0, length = players.length; i < length; i++) {
                const player = innerLoopFunc(i);
                if (player)
                    return player;
            }
        }
    }

    setMarksAndActive = (uid) => {
        const players = [...this.state.game.players]
            .map(user => {
                if (user.uid === uid) {
                    const score = user.score + 1;
                    const isActive = score === 5
                        ? false
                        : true;

                    return {
                        ...user,
                        isActive,
                        score
                    }
                }
                return user;
            });
        return players
    }

    checkNumberOfActivePlayers = (players) => {
        let activePlayers = players
            .filter(player => player.isActive === true);

        return activePlayers.length;
    }

    finishGame = (players) => {
        const winner = players.find(p => p.isActive).uid;
        return {
            playersUid: [...this.state.game.playersUid],
            players: players.map(({
                uid,
                displayName,
                photoURL,
                score
            }) => {
                return {
                    uid,
                    displayName,
                    photoURL,
                    score
                }
            }),
            winner,
            status: 'completed',
            lastUpdated: this.state.game.lastUpdated,
            title: this.state.game.title
        };
    }

    bustPrevPlayer = async () => {
        /**
         * Check if letters.join('') is a word via wordsapi.com
         * TODO: Show loader while awaing api
         * TODO: Log the results in chat
         */

        const word = [...this.state.game.letters].join('');
        const prevPlayerUid = this.getClosestActivePlayer(true);
        let setPreviousPlayerActive = false;
        let markUser;
        const wordDefintions = await this.getWordDetails(word);

        if (wordDefintions.success) {
            /** Previous player gets a mark. 
             * Current player starts new round */
            markUser = prevPlayerUid;
        } else {
            /** Current player gets a mark.
             * Previous player starts new round */
            markUser = this.props.uid;
            setPreviousPlayerActive = true;
        }

        this.prepareAlertForBustResult(wordDefintions, prevPlayerUid);
        this.finishRound(setPreviousPlayerActive, markUser);
    }

    prepareAlertForBustResult = (wordDefintions, prevPlayerUid) => {
        const prevDisplayName = this.state.game.players
            .find(player => player.uid === prevPlayerUid)
            .displayName;

        const instructions = wordDefintions.success
            ? `${prevDisplayName} got a mark and you will start the new round`
            : instructions = `You got a mark and ${prevDisplayName} will start the new round`;

        this.setResultAlertDataState({
            title: wordDefintions.success
                ? `${wordDefintions.word} is a word`
                : `${wordDefintions.word} is not a word`,
            subHeader: wordDefintions.success
                ? `${wordDefintions.word}: ${wordDefintions.definition}`
                : wordDefintions.message,
            instructions,
            buttons: ['Got it']
        });
    }

    setResultAlertDataState = (alertData) => {
        this.setState({
            resultsAlertData: {
                header: alertData.title,
                subHeader: alertData.subHeader,
                message: alertData.instructions,
                buttons: alertData.buttons
            }
        });
    }

    getWordDetails = async (word) => {
        /** 400	Bad Request -- Your request is invalid.
            401	Unauthorized -- Your API key is wrong.
            404	Not Found -- No matching word was found.
            500	Internal Server Error -- We had a problem with our server. Try again later.

            Eg 200
            definition: "the second day of the week; the first working day"
            message: ""
            partOfSpeech: "noun"
            success: true 
            
            Eg 404
            definition: ""
            message: "word not found"
            partOfSpeech: ""
            success: false */

        const url = `https://wordsapiv1.p.mashape.com/words/${word}/definitions`;
        let resObj = {
            success: true,
            word: '',
            partOfSpeech: '',
            definition: '',
            message: ''
        };

        try {
            let res = await fetch(url, {
                headers: {
                    "X-Mashape-Key": wordsApiKey
                }
            });

            if (res.status === 200) {
                const resJson = await res.json();
                const { word, definitions } = resJson;
                resObj = { ...resObj, word, ...definitions[0] };

            } else {
                const resJson = await res.json();
                resObj = { ...resObj, ...resJson };
            }
            return resObj;
        } catch (error) {
            console.error(error);
        }
    }

    finishRound = (
        setPreviousPlayerActive = false,
        markUser = this.props.uid
    ) => {
        /** Gets called when time is up - current user gets mark
         *  Gets called then user clicks "Send" button
         */
        let gameFinished = false;
        let completedGame = {}
        const updates = {};
        const letter = this.props.chosenLetter;
        if (letter) {
            updates['activePlayer'] = this.getClosestActivePlayer(false);
            updates['letters'] = !!this.props.lettersArray
                ? [...this.props.lettersArray, letter]
                : [letter];
        } else {
            const players = this.setMarksAndActive(markUser);
            const nrOfActivePlayers = this.checkNumberOfActivePlayers(players);
            if (nrOfActivePlayers === 1) {
                completedGame = this.finishGame(players);
                gameFinished = true;
            } else {
                const nextPlayer = setPreviousPlayerActive
                    ? this.getClosestActivePlayer(setPreviousPlayerActive)
                    : this.props.uid;
                updates['activePlayer'] = nextPlayer;
                updates['players'] = players;
            }
        }

        // if (gameFinished) {
        //     this.props.batchSet(completedGame);
        // } else {
        //     this.props.batchUpdate(updates);
        // }
        this.setShowResultsAlert(true)
        this.cleanUp();
    }

    cleanUp = () => {
        this.props.cleanUp();

        if (this.startInterval)
            clearInterval(this.startInterval);
        if (this.bufferInterval)
            clearInterval(this.bufferInterval);
        if (this.startTimer)
            clearTimeout(this.startTimer);
        if (this.progressbarTimer)
            clearTimeout(this.progressbarTimer);
    }

    setShowResultsAlert = (bool) => {
        this.setState({ showResultAlert: bool });
    }

    sendBtnClicked = () => {
        // TODO: Prepare result alert
        this.finishRound();
    }

    render() {
        return (
            <>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/" />
                        </IonButtons>
                        {this.state.game.letters &&
                            <IonButtons slot="end">
                                <Button
                                    disabled={!this.props.enablePlay}
                                    size="large"
                                    shape="round"
                                    onClick={() => this.initialize()}>
                                    <IonIcon icon={rewind}></IonIcon>
                                </Button>
                            </IonButtons>
                        }
                    </IonToolbar>
                </IonHeader>
                {/* TODO: If platform, touch or HTML5 */}
                <IonContent>
                    <IonAlert
                        isOpen={this.state.showResultAlert}
                        onDidDismiss={() => {
                            this.setShowResultsAlert(false);
                            this.props.history.push(`/scoreboard/${this.props.match.params.gameId}`);
                        }}
                        header={this.state.resultsAlertData.header}
                        subHeader={this.state.resultsAlertData.subHeader}
                        message={this.state.resultsAlertData.message}
                        buttons={this.state.resultsAlertData.buttons}
                    />
                    <DndProvider backend={this._dndBackend}>
                        <Wrapper>

                            <IonProgressBar
                                color={this.state.progressbarColor}
                                value={this.state.progressbarValue}
                                buffer={this.state.buffer}
                                reversed={this.state.buffer < 1 ? true : false}
                            ></IonProgressBar>
                            <LetterBox />
                            <MaxWidthContent>
                                <ActionsWrapper>
                                    {/* Send letter */}
                                    <Button
                                        onClick={this.sendBtnClicked}
                                        disabled={!this.props.enablePlay}
                                        size="large"
                                        fill="outline">
                                        <IonIcon slot="icon-only" icon={send}></IonIcon>
                                    </Button>
                                    {/* <Button size="large" disabled={!this.props.enablePlay} fill="outline">
                                        <IonIcon slot="icon-only" icon={glasses}></IonIcon>
                                    </Button> */}
                                    <Button
                                        onClick={this.bustPrevPlayer}
                                        size="large"
                                        disabled={!this.props.enablePlay
                                            || this.props.lettersArray.length < 3}
                                        fill="outline">
                                        <IonIcon slot="icon-only" icon={eye}></IonIcon>
                                    </Button>
                                </ActionsWrapper>
                                <Keyboard />
                            </MaxWidthContent>
                        </Wrapper>
                    </DndProvider>
                </IonContent>
            </>
        )
    }
}

const mapStateToProps = ({ firestore, firebase, gameReducer }) => ({
    uid: firebase.profile.uid,
    displayName: firebase.profile.displayName,
    photoURL: firebase.profile.photoURL,
    games: firestore.ordered.games,
    chosenLetter: gameReducer.letter,
    enablePlay: gameReducer.enablePlay,
    lettersArray: gameReducer.lettersArray
});

const mapDispatchToProps = {
    setEnablePlay: setEnablePlay,
    setLettersArray: setLettersArray,
    cleanUp: inGameCleanUp
};

export default compose(
    withFirestore,
    withHandlers({
        batchUpdate: ({ firestore, match }) => (fieldsToUpdate) => {
            const gameId = match.params.gameId;
            return firestore.update({
                collection: `games`,
                doc: gameId
            }, { ...fieldsToUpdate, lastUpdated: Date.now() })
        },
        batchSet: ({ firestore, match }) => (data) => {
            const gameId = match.params.gameId;
            return firestore.set({
                collection: `games`,
                doc: gameId
            }, data)
        }
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ))(Game)