import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/game/drag-n-drop/LetterBox';
import Keyboard from '../components/game/drag-n-drop/Keyboard';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonLabel, IonProgressBar } from '@ionic/react';
import styled from 'styled-components';
import { FlexboxCenter } from '../components/UI/DivUI';
import { setEnablePlay } from '../store/actions';

const Wrapper = styled(FlexboxCenter)`height: 70vh;`

export class Game extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            game: {},
            timeLeft: 25,
            progressbarValue: 0,
            buffer: 0
        };
    }

    componentDidMount() {
        this.setEnablePlay(false);
        this._isMounted = true;
        if (!this.props.games || !this.props.match.params.gameId) {
            this.props.history.push('/');
        } else {
            const gameId = this.props.match.params.gameId;
            const game = this.props.games.find(game => game.id == gameId);

            if (this._isMounted)
                this.setState({ game, gameId });

            this.prepareForGameStart(game);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.cleanUp();
    }

    prepareForGameStart = (game) => {
        const length = game.letters.length ?
            game.letters.length : 0;

        const timeout = (!!length ?
            (500 + (1200 * length)) : 800);

        let buffer = 0;
        this.bufferInterval = setInterval(() => {
            if (buffer < 1) {
                buffer += 0.01;
                if (this._isMounted)
                    this.setState({ buffer })
            }
            else {
                this.setEnablePlay(true);
                clearInterval(this.bufferInterval);
            }
        }, (timeout / 100));

        this.startGameTimer = setTimeout(() => {
            this.startTimer();
            this.startPogressbarTimer(0);
        }, timeout);
    }

    setEnablePlay = (bool) => {
        this.props.setEnablePlay(bool);
    }

    startTimer = () => {
        this.startInterval = setInterval(() => {
            const timeLeft = this.state.timeLeft - 1;
            if (this._isMounted)
                this.setState({ timeLeft })
            if (timeLeft === 0) {
                this.finishRound();
            }
        }, 1000);
    }

    startPogressbarTimer = (progressbarValue) => {
        this.progressbarTimer = setInterval(() => {
            if (progressbarValue < 1) {
                progressbarValue += 0.01;
                if (this._isMounted)
                    this.setState({ progressbarValue })
            }
            else {
                clearInterval(this.progressbarTimer);
            }
        }, 25000 / 100);
    }

    finishRound = () => {
        this.cleanUp();
        const letter = this.props.chosenLetter;
        if (letter) {
            console.log('Letter:', letter)
        } else {
            console.log('No letter')
        }
    }

    cleanUp = () => {
        if (this.startInterval)
            clearInterval(this.startInterval);
        if (this.bufferInterval)
            clearInterval(this.bufferInterval);
        if (this.startTimer)
            clearTimeout(this.startTimer);
        if (this.progressbarTimer)
            clearTimeout(this.progressbarTimer);

        this.setEnablePlay(false);
    }

    render() {
        return (
            <>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/" />
                        </IonButtons>
                        <IonLabel slot='end'>{this.state.timeLeft}</IonLabel>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    {/* TODO: If platform, touch or HTML5 */}
                    <IonProgressBar
                        value={this.state.progressbarValue}
                        buffer={this.state.buffer}
                        reversed={this.state.buffer < 1 ? true : false}
                    ></IonProgressBar>
                    <br />
                    <DndProvider backend={HTML5Backend}>
                        <Wrapper>
                            <FlexboxCenter>
                                {this.state.game.letters &&
                                    <LetterBox lettersArr={this.state.game.letters} />}
                            </FlexboxCenter>
                            <Keyboard />
                        </Wrapper>
                    </DndProvider>
                </IonContent>
            </>
        )
    }
}

const mapStateToProps = ({ firestore, gameReducer }) => ({
    games: firestore.ordered.games,
    chosenLetter: gameReducer.letter,
    enablePlay: gameReducer.enablePlay
});

const mapDispatchToProps = {
    setEnablePlay: setEnablePlay
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)