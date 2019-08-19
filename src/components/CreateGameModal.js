import React, { useState, useEffect } from 'react';
import { IonItem, IonInput, IonLabel, IonList, IonListHeader, IonAvatar } from '@ionic/react';
import { connect } from 'react-redux';
import InviteFriend from './InviteFriendItem';

let invitedArr = [];

const CreateGameModal = ({ profile }) => {
    return (<>
        <IonItem>
            <IonLabel position="floating">Game name</IonLabel>
            <IonInput></IonInput>
        </IonItem>
        <IonList>
            <IonListHeader>Friends</IonListHeader>
            {profile.friends && profile.friends.map(friend => {
                return (
                    <div
                        key={friend.uid}
                        onClick={() => {
                            if (invitedArr.includes(friend.uid)) {
                                invitedArr = invitedArr.filter(
                                    id => id !== friend.uid
                                );
                            } else {
                                invitedArr.push(friend.uid);
                            }
                            console.log('Invited users:', invitedArr);
                        }}>
                        <InviteFriend friend={friend} />
                    </div>)
            })}
        </IonList>
    </>
    )
}

const mapStateToProps = ({ firebase }) => ({
    profile: firebase.profile
});

export default connect(mapStateToProps)(CreateGameModal);
