import React from 'react';
import { IonItem, IonInput, IonLabel, IonList, IonListHeader } from '@ionic/react';
import { connect } from 'react-redux';
import InviteFriend from './InviteFriendItem';
import { setTitle, setInvites } from '../../../store/actions';
import SearchUser from '../../SearchUser';

let invitedArr = [];

const RenderFriendComponent = (user) => {
    return <InviteFriend
        friend={user}
        invited={
            invitedArr.find(invited =>
                invited.uid === user.uid)
                ? 'Invited' : 'Not invited'
        } />
}

const CreateGameModal = ({ friends = [], title, setTitle, setInvites, searchResult = [] }) => {
    const setGameTitle = (e) => {
        const txt = e.currentTarget.value;
        setTitle(txt);
    }

    const toggleInvites = (user) => {
        if (invitedArr.find(invited => invited.uid === user.uid)) {
            invitedArr = invitedArr.filter(
                invited => invited.uid !== user.uid
            );
        } else {
            invitedArr.push(user);
        }

        setInvites(invitedArr);
    }

    return (<>
        <IonItem>
            <IonLabel position="floating">Game name</IonLabel>
            {/* TODO: onChange dont work (bug in ionic/react) */}
            <IonInput value={title} onInput={setGameTitle}></IonInput>
        </IonItem>
        <SearchUser />
        {searchResult && searchResult.map(result => {
            return <div key={result.uid}
                onClick={() => { toggleInvites(result) }}>
                <IonListHeader>Search result</IonListHeader>
                {RenderFriendComponent(result)}
            </div>
        })}
        <IonList>
            <IonListHeader>Friends</IonListHeader>
            {friends && friends
                .filter(friend => {
                    if (searchResult) {
                        return !!!searchResult.find(invited => invited.uid === friend.uid);
                    }
                    return true;
                })
                .map(friend => {
                    return (
                        <div key={friend.uid}
                            onClick={() => { toggleInvites(friend) }}>
                            {RenderFriendComponent(friend)}
                        </div>)
                })}
        </IonList>
    </>
    )
}

const mapStateToProps = ({ firebase, firestore, createGame }) => ({
    friends: firebase.profile.friends,
    searchResult: firestore.ordered.searchResult,
    title: createGame.title
});
const mapDispatchToProps = {
    setTitle: setTitle,
    setInvites: setInvites
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGameModal);
