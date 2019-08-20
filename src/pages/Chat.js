import React from 'react'
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';

const Chat = () => {
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
                Chat Page
            </IonContent>
        </>
    )
}

export default Chat
