import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/dragNdrop/LetterBox';
import Keyboard from '../components/dragNdrop/Keyboard';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonLabel, IonProgressBar } from '@ionic/react';
import styled from 'styled-components';

const LetterBoxConstainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Wrapper = styled(LetterBoxConstainer)`height: 70vh;`

export class Game extends Component {
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
        if (!this.props.games || !this.props.match.params.gameId) {
            this.props.history.push('/');
        } else {
            const gameId = this.props.match.params.gameId;
            const game = this.props.games.find(game => game.id == gameId);
            
            this.setState({ game, gameId });
            this.prepareForGameStart(game);
        }
    }

    componentWillUnmount() {
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
                this.setState({ buffer })
            }
            else {
                clearInterval(this.bufferInterval);
            }
        }, (timeout / 100));

        this.startGameTimer = setTimeout(() => {
            this.startTimer();
            this.startPogressbarTimer(0);
        }, timeout);
    }

    startTimer = () => {
        this.startInterval = setInterval(() => {
            const timeLeft = this.state.timeLeft - 1;
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
                this.setState({ progressbarValue })
            }
            else {
                clearInterval(this.progressbarTimerz);
            }
        }, 25000 / 100);
    }

    finishRound = () => {
        // alert('times up');
        this.cleanUp();
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
                            <LetterBoxConstainer>
                                {this.state.game.letters &&
                                    <LetterBox lettersArr={this.state.game.letters} />}
                            </LetterBoxConstainer>
                            <Keyboard />
                        </Wrapper>
                    </DndProvider>
                </IonContent>
            </>
        )
    }
}

export default connect(({ firestore }) => ({
    games: firestore.ordered.games
}))(Game)