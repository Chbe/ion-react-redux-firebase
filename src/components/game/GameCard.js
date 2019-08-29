import React from 'react';
import styled from 'styled-components';
import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonCard, IonAvatar, IonLabel, IonItem } from '@ionic/react';

const appendZero = (value) => {
    return value < 10 ? `0${value}` : value;
}

const formatDate = (date) => {
    const current_datetime = new Date(date);
    const formatted_date =
        `${current_datetime.getFullYear()}-${appendZero((current_datetime.getMonth() + 1))}-${appendZero(current_datetime.getDate())} ${current_datetime.getHours()}:${current_datetime.getMinutes()}`
    return formatted_date;
}

const setBg = (activePlayer, uid) => {
    if (activePlayer === uid) {
        return 'medium';
    } else {
        return 'tertiary';
    }
}

const GameCard = ({ game, uid, history }) => {
    const href = (game.status === 'active'
        && game.activePlayer === uid)
        ? `/game/${game.id}`
        : `/chat/${game.id}`;
    return (
        <IonCard
            color={setBg(game.activePlayer, uid)}
            onClick={(e) => {
                e.preventDefault();
                history.push(href);
            }}>
            <IonCardHeader>
                <IonItem color={setBg(game.activePlayer, uid)}>
                    <IonAvatar slot="start">
                        {/* TODO: Avatar for pending etc? */}
                        {game.status === 'active'
                            && <img src={game.players.find(p => p.uid === game.activePlayer).photoURL}
                                alt={uid}
                            />}
                    </IonAvatar>
                    <IonLabel>{game.status === 'pending'
                        ? game.status
                        : game.activePlayer === uid
                            ? 'Your turn'
                            : `${game.players.find(p => p.uid === game.activePlayer).displayName}'s turn`
                    }</IonLabel>
                </IonItem >
                <IonCardTitle
                    style={{
                        textAlign: 'center'
                    }}
                >{game.title}
                </IonCardTitle>
            </IonCardHeader >
            <IonCardContent>
                {formatDate(game.lastUpdated)}
            </IonCardContent>
        </IonCard >
    )
}

export default GameCard
