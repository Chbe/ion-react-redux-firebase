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

const setBg = (status, activePlayer, uid) => {
    if (status === 'pending') {
        return '--ion-color-light';
    } else if (activePlayer === uid) {
        return '--ion-color-success';
    } else {
        return '--ion-color-primary';
    }
}

// TODO: hehe some design focus maybe?
const ActivePendingGame = styled(IonCard)`
  --background: var(${({ bg }) => (bg)});
`;

const GameCard = ({ game, uid, history }) => {
    const href = (game.status === 'active'
        && game.activePlayer.uid === uid)
        ? `/game/${game.id}`
        : `/chat/${game.id}`;
    return (
        <ActivePendingGame
            bg={setBg(game.status, game.activePlayer.uid, uid)}
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
        </ActivePendingGame >
    )
}

export default GameCard
