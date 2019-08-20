import React from 'react'
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';

const Game = () => {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="home" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Game Page
            </IonContent>
        </>
    )
}

export default Game
