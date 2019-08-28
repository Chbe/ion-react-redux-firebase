import React, { useEffect } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonContent, IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

const Chat = ({ history, match: { params: { gameId } } }) => {
    useEffect(() => {
        console.log('Chat enter');
        return () => {
            console.log('Chat leave');
        };
    }, [])
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={(e) => {
                            e.preventDefault();
                            history.push('/');
                        }}>
                            <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Chat Page. Will be developed after game functionality is in place.
                <br />
                Chat ID: {gameId}
            </IonContent>
        </>
    )
}

export default Chat
