import React from 'react';
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

const GameCard = ({ game, history }) => {
    return (
        <IonCard
            // style={{ '--background': 'var(--ion-color-light-shade)' }}
            onClick={(e) => {
                e.preventDefault();
                history.push(`/chat/${game.id}`);
            }}>
            <IonCardHeader>
                <IonCardSubtitle>
                    Winner - {game.players.find(p => p.uid === game.winner).displayName}
                </IonCardSubtitle>
                <IonCardTitle
                    style={{
                        textAlign: 'center'
                    }}
                >{game.title}
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {formatDate(game.lastUpdated)}
            </IonCardContent>
        </IonCard>
    )
}

export default GameCard
