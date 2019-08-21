import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import LetterBox from '../components/dragNdrop/LetterBox';
import Keyboard from '../components/dragNdrop/Keyboard';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';

const lettersArr = ['a', 'b', 'd']; // TODO: Dev
const Game = () => {
    useEffect(() => {
        console.log('Game enter');
        return () => {
            console.log('Game leave');
        };
    }, [])
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* TODO: If platform, touch or HTML5 */}
                <DndProvider backend={HTML5Backend}>
                    <div style={wrapper}>
                        <div style={letterBoxConstainer}>
                            <LetterBox lettersArr={lettersArr} />
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

export default Game
