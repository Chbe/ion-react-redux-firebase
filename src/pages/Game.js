import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/dragNdrop/LetterBox';
import Keyboard from '../components/dragNdrop/Keyboard';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonLabel } from '@ionic/react';
import styled from 'styled-components';

const LetterBoxConstainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Wrapper = styled(LetterBoxConstainer)`height: 70vh;`

const Game = ({ match: { params: { gameId } }, games, history }) => {
    if (!games) history.push('/');
    const [game, updateGame] = useState({});
    useEffect(() => {
        console.log('Game Page Enter');
        games && updateGame(games.find(game => game.id == gameId));
        return () => {
            console.log('Game Page Leave');
        };
    }, [])
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonLabel>{game && game.title}</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* TODO: If platform, touch or HTML5 */}
                <DndProvider backend={HTML5Backend}>
                    <Wrapper>
                        <LetterBoxConstainer>
                            {game.letters && <LetterBox lettersArr={game.letters} />}
                        </LetterBoxConstainer>
                        <Keyboard />
                    </Wrapper>
                </DndProvider>
            </IonContent>
        </>
    )
}



export default connect(({ firestore }) => ({
    games: firestore.ordered.games
}))(Game)