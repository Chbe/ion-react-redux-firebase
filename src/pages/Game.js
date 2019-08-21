import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/dragNdrop/LetterBox';
import Keyboard from '../components/dragNdrop/Keyboard';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonLabel } from '@ionic/react';

const Game = ({ match: { params: { gameId } }, games, history }) => {
    if(!games) history.push('/');
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
                    <div style={wrapper}>
                        <div style={letterBoxConstainer}>
                            {game.letters && <LetterBox lettersArr={game.letters} />}
                        </div>
                        <Keyboard />
                    </div>
                </DndProvider>
            </IonContent>
        </>
    )
}

const letterBoxConstainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const wrapper = {
    ...letterBoxConstainer,
    height: '70vh'
}

export default connect(({ firestore }) => ({
    games: firestore.ordered.games
}))(Game)