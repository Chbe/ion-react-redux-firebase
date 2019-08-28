import React from 'react';
import styled from 'styled-components';
import { IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonCard } from '@ionic/react';

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
        return 'dark';
    } else {
        return 'tertiary';
    }
}

const GameCard = ({ game, uid, history }) => {
    const href = (game.status === 'active'
        && game.activePlayer.uid === uid)
        ? `/game/${game.id}`
        : `/chat/${game.id}`;
    return (
        <IonCard
            color={setBg(game.activePlayer.uid, uid)}
            onClick={(e) => {
                e.preventDefault();
                history.push(href);
            }}>
            <IonCardHeader>
                <IonCardSubtitle>
                    {game.status === 'pending' ?
                        game.status :
                        game.activePlayer.uid === uid ?
                            'Your turn' :
                            `${game.activePlayer.displayName}'s turn`
                    }
                </IonCardSubtitle >
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
