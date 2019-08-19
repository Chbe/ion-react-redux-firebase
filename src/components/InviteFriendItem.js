import React, { useState } from 'react'
import { IonAvatar, IonLabel, IonItem } from '@ionic/react';

const InviteFriend = ({ friend }) => {
    const invite = 'Not invited';
    const uninvite = 'Invited';
    const [btnText, setBtnText] = useState(invite);

    return (
        <IonItem
            onClick={() => {
                setBtnText(btnText === invite ? uninvite : invite);
            }}
        >
            <IonAvatar slot="start">
                <img src={friend.photoURL} />
            </IonAvatar>
            <IonLabel>
                <h2>{friend.displayName}</h2>
                <p>{btnText}</p>
            </IonLabel>
        </IonItem>
    )
}

export default InviteFriend
