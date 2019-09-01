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
import { prepareAlertForBustResult, prepareAlertForTimesUp, prepareResultAlert, getClosestActivePlayer, setMarksAndActive, getWordDetails } from '../services/game/in-game/InGameService';

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
                const dataForResultAlert = { type: 'timesup' };
                this.finishRound(dataForResultAlert);
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
         * TODO: Show loader while awaing api
         * TODO: Log the results in chat
         */
        const players = this.state.game.players;
        const uid = this.props.uid;
        const word = [...this.state.game.letters].join('');
        const prevPlayerUid = getClosestActivePlayer(players, true, uid);
        let setPreviousPlayerActive = false;
        let markUser;
        const wordDefintions = await getWordDetails(word);

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

        const dataForResultAlert = { type: 'bust', data: { wordDefintions, prevPlayerUid } };
        this.finishRound(dataForResultAlert, setPreviousPlayerActive, markUser);
    }

    finishRound = (
        dataForResultAlert,
        setPreviousPlayerActive = false,
        markUser = this.props.uid,
    ) => {
        let gameFinished = false;
        let completedGame = {}
        const updates = {};
        const gamePlayers = this.state.game.players;
        const uid = this.props.uid;
        const letter = this.props.chosenLetter;
        if (letter) {
            updates['activePlayer'] = getClosestActivePlayer(gamePlayers, false, uid);
            updates['letters'] = !!this.props.lettersArray
                ? [...this.props.lettersArray, letter]
                : [letter];
        } else {
            const updatedPlayersArr = setMarksAndActive(gamePlayers, markUser);
            const nrOfActivePlayers = this.checkNumberOfActivePlayers(updatedPlayersArr);
            if (nrOfActivePlayers === 1) {
                completedGame = this.finishGame(updatedPlayersArr);
                gameFinished = true;
            } else {
                const nextPlayer = setPreviousPlayerActive
                    ? getClosestActivePlayer(gamePlayers, true, uid)
                    : uid;
                updates['activePlayer'] = nextPlayer;
                updates['players'] = updatedPlayersArr;
            }
        }
        const alertWillShow = this.prepareAlert(dataForResultAlert, letter, completedGame);

        // if (gameFinished) {
        //     this.props.batchSet(completedGame);
        // } else {
        //     this.props.batchUpdate(updates);
        // }

        if (!alertWillShow)
            this.redirectToScoreboard()

        this.cleanUp();
    }

    prepareAlert = ({ type, data }, letter, completedGame) => {
        const players = this.state.game.players;
        let alertDataIsSet = false;
        let alertData = {};
        if (type === 'bust') {
            alertData = prepareAlertForBustResult(players, data, completedGame)
            this.setResultAlertDataState(alertData);
            alertDataIsSet = true;
        } else if (!letter && type === 'timesup') {
            alertData = prepareAlertForTimesUp(players, completedGame);
            alertDataIsSet = true;
        } else if (!letter && type === 'sendBtn') {
            alertData = prepareResultAlert(players, completedGame);
            alertDataIsSet = true;
        }
        if (alertDataIsSet) {
            this.setResultAlertDataState(alertData);
            this.setShowResultsAlert(true);
        }
        return alertDataIsSet;
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

    sendBtnClicked = () => {
        const dataForResultAlert = { type: 'sendBtn' };
        this.finishRound(dataForResultAlert);
    }
    
    setShowResultsAlert = (bool) => {
        this.setState({ showResultAlert: bool });
    }

    redirectToScoreboard = () => {
        this.props.history.push(`/scoreboard/${this.props.match.params.gameId}`);
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
                <IonContent>
                    <IonAlert
                        isOpen={this.state.showResultAlert}
                        onDidDismiss={() => {
                            this.setShowResultsAlert(false);
                            this.redirectToScoreboard();
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