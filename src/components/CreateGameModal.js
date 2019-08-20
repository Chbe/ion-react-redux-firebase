import React, { useState, useEffect } from 'react';
import { IonItem, IonInput, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { connect } from 'react-redux';
import InviteFriend from './InviteFriendItem';
import { setTitle, setInvites } from '../store/actions';

let invitedArr = [];

const CreateGameModal = ({ profile, title, setTitle, setInvites }) => {

    const setGameTitle = (e) => {
        const txt = e.currentTarget.value;
        setTitle(txt);
    }

    return (<>
        <IonItem>
            <IonLabel position="floating">Game name</IonLabel>
            {/* TODO: onChange dont work (bug in ionic/react) */}
            <IonInput value={title} onInput={setGameTitle}></IonInput>
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
                                    invited => invited.uid !== friend.uid
                                );
                            } else {
                                invitedArr.push(friend);
                            }
                            setInvites(invitedArr);
                        }}>
                        <InviteFriend friend={friend} />
                    </div>)
            })}
        </IonList>
    </>
    )
}

const mapStateToProps = ({ firebase, createGame }) => ({
    profile: firebase.profile,
    title: createGame.title
});
const mapDispatchToProps = {
    setTitle: setTitle,
    setInvites: setInvites
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGameModal);
