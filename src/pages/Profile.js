import React from 'react';
import { connect } from 'react-redux'
import { compose } from 'redux';
import { logOut } from 'ionicons/icons';
import {
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonAvatar,
    IonItem,
    IonSkeletonText,
    IonLabel
} from '@ionic/react';
import { withFirebase } from 'react-redux-firebase';

const Profile = ({ profile, firebase }) => {
    const avatars = ['https://firebasestorage.googleapis.com/v0/b/word-tail-22d50.appspot.com/o/avatars%2Fblack_blondie_w_beard.svg?alt=media&token=c5a4ed42-e9db-4ccd-a716-7165cc09dbeb',
        'https://firebasestorage.googleapis.com/v0/b/word-tail-22d50.appspot.com/o/avatars%2Fblonde_w_mustasch.svg?alt=media&token=483c26fc-075d-4551-84de-1a75350461b4',
        'https://firebasestorage.googleapis.com/v0/b/word-tail-22d50.appspot.com/o/avatars%2Fginger_w_mustasch.svg?alt=media&token=ea67d0c3-3caa-47b9-810a-025f925e2476'];

    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    return (
        <>
            <IonHeader>
                <IonToolbar color="medium">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="home" />
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton
                            onClick={(ev) => {
                                ev.preventDefault();
                                firebase.logout();
                            }}>
                            <IonIcon slot="icon-only" icon={logOut}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard color="light">
                    <IonItem color="primary">
                        <IonAvatar>
                            {profile.photoURL ?
                                <img src={profile.photoURL}
                                    alt={profile.displayName}
                                    style={{
                                        width: '10em'
                                    }} /> :
                                <IonSkeletonText animated />
                            }
                        </IonAvatar>
                        <IonLabel style={{ marginLeft: '1em' }}>
                            {profile.isAnonymous ?
                                'Mysterious User' :
                                profile.displayName}
                        </IonLabel>
                    </IonItem>
                    <IonCardHeader>
                        <IonCardSubtitle>UID: {profile.uid}</IonCardSubtitle>
                        <IonCardTitle>{profile.isAnonymous ?
                            'Mysterious User' :
                            profile.displayName}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {profile && profile.email}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </>
    )
}

const mapStateToProps = ({ firebase }) => ({
    profile: firebase.profile
});

export default compose(
    withFirebase,
    connect((mapStateToProps))
)(Profile)
