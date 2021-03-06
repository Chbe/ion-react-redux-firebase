import React from 'react';
import { IonItemSliding, IonItem, IonIcon, IonLabel, IonItemOptions, IonItemOption } from '@ionic/react';
import { arrowDropleft, mail, closeCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

const GameInvite = ({ invite, uid, firestore }) => {

    const answerInvite = (game, accept) => {
        if (accept) {
            const players = [...game.players]
                .map(p => {
                    if (p.uid === uid) {
                        return { ...p, accepted: true, isActive: true }
                    }
                    return p;
                });
            firestore.update(`games/${game.id}`, {
                players,
                ...startGame(game.status, game.admin, players)
            });
        } else {
            const players = [...game.players.filter(player => player.uid !== uid)];
            if (players.length === 1) {
                firestore.delete(`games/${game.id}`);
            } else {
                firestore.update(`games/${game.id}`, {
                    players,
                    playersUid: [...game.playersUid.filter(_uid => _uid !== uid)],
                    ...startGame(game.status, game.admin, players)
                });
            }
        }
    }

    const startGame = (status, admin, players) => {
        const arrOfUnaccepted = players.filter(player => !player.accepted);
        console.log(
            `unaccepted: ${!arrOfUnaccepted}
            `
        );
        return !!arrOfUnaccepted && !!arrOfUnaccepted.length
            ? { status }
            : { status: 'active', activePlayer: admin }
    }

    return (
        <IonItemSliding>
            <IonItem
                color="light" // Or light?
                detailIcon={arrowDropleft}>
                <IonIcon slot="start" color="primary" icon={mail}></IonIcon>
                <IonLabel>
                    <h2 style={{ color: 'var(--ion-color-primary)' }}>New Invite</h2>
                    <p style={{ color: 'var(--ion-color-medium-tint)' }}>from {invite.players.find(player =>
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
