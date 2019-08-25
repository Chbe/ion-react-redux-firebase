import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withHandlers } from 'recompose';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/game/drag-n-drop/LetterBox';
import Keyboard from '../components/game/drag-n-drop/Keyboard';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonProgressBar, IonIcon, IonButton } from '@ionic/react';
import styled from 'styled-components';
import { FlexboxCenter } from '../components/UI/DivUI';
import { setEnablePlay, setLettersArray, inGameCleanUp } from '../store/actions';
import { rewind, glasses, eye, send } from 'ionicons/icons';
import { isPlatform } from '@ionic/react'; // TODO: Should it be core or react????
import { withFirestore } from 'react-redux-firebase';

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
            progressbarColor: 'primary'
        };
    }

    UNSAFE_componentWillMount() {
        this._isMounted = true;
        if (!this.props.games || !this.props.match.params.gameId) {
            this.props.history.push('/');
        } else {
            const gameId = this.props.match.params.gameId;
            const game = this.props.games.find(game => game.id == gameId);
            this.safeStateUpdate({ game, gameId });
            this.props.setLettersArray(game.letters);
            this.prepareForGameStart(game);
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this._isMounted = false;
        this.cleanUp();
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

    checkIfUserLost = (score) => {
        return score === 5 ? true : false;
    }

    setScoreboard = () => {
        const displayName = this.props.displayName;
        const uid = this.props.uid;
        const photoURL = this.props.photoURL
        let scoreboard = this.state.game.scoreboard;
        let userScore;
        scoreboard = !!scoreboard.length
            ? scoreboard.map(obj => {
                if (obj.uid === uid) {
                    userScore = obj.score + 1;
                    return {
                        ...obj,
                        score: userScore
                    }
                }
                return obj;
            })
            : [{ uid, displayName, photoURL, score: 1 }];

        const userLost = this.checkIfUserLost(userScore);
        return { scoreboard, userLost };
    }

    finishRound = () => {
        const letter = this.props.chosenLetter;
        if (letter) {
            const arrOfLetters = !!this.props.lettersArray
                ? [...this.props.lettersArray, letter]
                : [letter];
            this.props.addLetter(arrOfLetters);
        } else {
            const { scoreboard, userLost } = this.setScoreboard();

            if (userLost) {
                /**
                 * TODO: Show lost page, score or whatev and start new round.
                 * User gets kick out of the game, but game game continues.
                 * If theres only 2 players left, the second one wins.
                 */
                this.props.setUserScore(scoreboard);
                this.props.history.push(`/scoreboard/${this.props.match.params.gameId}`);
            } else {
                // TODO: Start new round
                // Save scores to Firestore
                this.props.setUserScore(scoreboard);
                this.props.history.push(`/scoreboard/${this.props.match.params.gameId}`);
            }
        }
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

    render() {
        return (
            <>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/" />
                        </IonButtons>
                        {this.state.game.letters &&
                            <IonButtons slot="end">
                                <Button
                                    disabled={!this.props.enablePlay}
                                    size="large"
                                    shape="round"
                                    onClick={() => console.log('show letters')}>
                                    <IonIcon icon={rewind}></IonIcon>
                                </Button>
                            </IonButtons>
                        }
                    </IonToolbar>
                </IonHeader>
                {/* TODO: If platform, touch or HTML5 */}
                <DndProvider backend={this._dndBackend}>
                    <Wrapper>
                        <IonProgressBar
                            color={this.state.progressbarColor}
                            value={this.state.progressbarValue}
                            buffer={this.state.buffer}
                            reversed={this.state.buffer < 1 ? true : false}
                        ></IonProgressBar>
                        <LetterBox />
                        <div>
                            <ActionsWrapper>
                                <Button
                                    onClick={this.finishRound}
                                    disabled={!this.props.enablePlay}
                                    fill="outline">
                                    <IonIcon slot="icon-only" icon={send}></IonIcon>
                                </Button>
                                <Button disabled={!this.props.enablePlay} fill="outline">
                                    <IonIcon slot="icon-only" icon={glasses}></IonIcon>
                                </Button>
                                <Button disabled={!this.props.enablePlay} fill="outline">
                                    <IonIcon slot="icon-only" icon={eye}></IonIcon>
                                </Button>
                            </ActionsWrapper>
                            <Keyboard />
                        </div>
                    </Wrapper>
                </DndProvider>
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
        addLetter: ({ firestore, match }) => (lettersArr) => {
            const gameId = match.params.gameId;
            return firestore.update({
                collection: `games`,
                doc: gameId
            }, { letters: lettersArr })
        },
        setUserScore: ({ firestore, match }) => (scoreboard) => {
            const gameId = match.params.gameId;
            return firestore.update({
                collection: `games`,
                doc: gameId
            }, { scoreboard: scoreboard })
        }
    }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ))(Game)