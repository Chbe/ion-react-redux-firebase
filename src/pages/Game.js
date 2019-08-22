import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/game/drag-n-drop/LetterBox';
import Keyboard from '../components/game/drag-n-drop/Keyboard';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonProgressBar, IonIcon, IonButton, IonItem } from '@ionic/react';
import styled from 'styled-components';
import { FlexboxCenter } from '../components/UI/DivUI';
import { setEnablePlay } from '../store/actions';
import { rewind, glasses, eye, send } from 'ionicons/icons';
import { isPlatform, getPlatforms } from '@ionic/react'; // TODO: Should it be core or react????

const Wrapper = styled(FlexboxCenter)`
    height: 90vh;
    justify-content: space-between;
    flex-direction: column;
`

const ActionsWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`;

export class Game extends Component {
    // TODO: Dev: HTML5 and prod touch?
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
            buffer: 0
        };
    }

    componentDidMount() {
        console.log(this._dndBackend);
        console.log(getPlatforms())
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
        const length = game.letters ?
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
            // Push letter to firestore
            console.log('Letter:', letter)
        } else {
            // Set minus point to user
            // TODO: When point is changed for a user - firebase function?
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
                        {this.state.game.letters &&
                            <IonButtons slot="end">
                                <IonButton
                                    size="large"
                                    shape="round"
                                    onClick={() => console.log('show letters')}>
                                    <IonIcon icon={rewind}></IonIcon>
                                </IonButton>
                            </IonButtons>
                        }
                    </IonToolbar>
                </IonHeader>
                {/* TODO: If platform, touch or HTML5 */}
                <DndProvider backend={this._dndBackend}>
                    <Wrapper>
                        <IonProgressBar
                            value={this.state.progressbarValue}
                            buffer={this.state.buffer}
                            reversed={this.state.buffer < 1 ? true : false}
                        ></IonProgressBar>
                        <LetterBox lettersArr={this.state.game && this.state.game.letters} />
                        <div style={{ padding: '1em' }}>
                            <ActionsWrapper>
                                <IonButton disabled={!this.props.enablePlay} fill="outline">
                                    <IonIcon slot="icon-only" icon={send}></IonIcon>
                                </IonButton>
                                <IonButton disabled={!this.props.enablePlay} fill="outline">
                                    <IonIcon slot="icon-only" icon={glasses}></IonIcon>
                                </IonButton>
                                <IonButton disabled={!this.props.enablePlay} fill="outline">
                                    <IonIcon slot="icon-only" icon={eye}></IonIcon>
                                </IonButton>
                            </ActionsWrapper>
                            <Keyboard />
                        </div>
                    </Wrapper>
                </DndProvider>
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