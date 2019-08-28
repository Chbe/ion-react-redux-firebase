import React from 'react';
import { IonItemSliding, IonItem, IonIcon, IonLabel, IonItemOptions, IonItemOption } from '@ionic/react';
import { arrowDropleft, mail, closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

const GameInvite = ({ invite, uid, firestore }) => {

    const answerInvite = (game, accept) => {
        if (accept) {
            // TODO: Check if game can start
            const acceptedInvites = [...game.acceptedInvites, uid];
            firestore.update(`games/${game.id}`, {
                acceptedInvites,
                ...startGame(game.status, game.players, game.admin, acceptedInvites)
            });
        } else {
            // TODO: Check if game shall start or cancel
            const playersUid = [...game.playersUid.filter(p => p.uid !== uid)];
            if (playersUid.length === 1) {
                firestore.delete(`games/${game.id}`);
            } else {
                firestore.update(`games/${game.id}`, {
                    players: [...game.players.filter(p => p.uid !== uid)],
                    playersUid,
                    ...startGame(game.status, game.players, game.admin, playersUid)
                });
            }
        }
    }

    const startGame = (status, players, admin, acceptedInvites) => {
        return acceptedInvites.length === players.length
            ? { status: 'active', activePlayer: players.find(p => p.uid === admin) }
            : { status }
    }
    
    return (
        <IonItemSliding>
            <IonItem color="light" detailIcon={arrowDropleft}>
                <IonIcon slot="start" color="primary" icon={mail}></IonIcon>
                <IonLabel>
                    <h2 style={{color: 'var(--ion-color-primary)'}}>New Invite</h2>
                    <p>from {invite.players.find(player =>
                        player.uid === invite.admin)
                        .displayName}</p>
                </IonLabel>
            </IonItem>
            <IonItemOptions side='start'>
                <IonItemOption
                    expandable
                    color='danger'
                    onClick={(ev) => {
                        ev.preventDefault();
                        answerInvite(invite, false);
                    }}
                >
                    <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
                    Reject
                  </IonItemOption>
            </IonItemOptions>
            <IonItemOptions side='end'>
                <IonItemOption
                    expandable
                    color='success'
                    onClick={(ev) => {
                        ev.preventDefault();
                        answerInvite(invite, true);
                    }}
                >
                    <IonIcon slot="end" icon={checkmarkCircleOutline}></IonIcon>
                    Accept
                  </IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    )
}

export default GameInvite
