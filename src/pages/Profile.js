import React, { useState, useEffect } from 'react';
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
    IonAvatar,
    IonItem,
    IonSkeletonText,
    IonLabel,
    IonInput
} from '@ionic/react';
import { withFirebase } from 'react-redux-firebase';
import { MaxWidthContent } from '../components/UI/DivUI';

const Profile = ({ profile, firebase }) => {
    const avatars = ['https://firebasestorage.googleapis.com/v0/b/word-tail-22d50.appspot.com/o/avatars%2Fblack_blondie_w_beard.svg?alt=media&token=c5a4ed42-e9db-4ccd-a716-7165cc09dbeb',
        'https://firebasestorage.googleapis.com/v0/b/word-tail-22d50.appspot.com/o/avatars%2Fblonde_w_mustasch.svg?alt=media&token=483c26fc-075d-4551-84de-1a75350461b4',
        'https://firebasestorage.googleapis.com/v0/b/word-tail-22d50.appspot.com/o/avatars%2Fginger_w_mustasch.svg?alt=media&token=ea67d0c3-3caa-47b9-810a-025f925e2476'];
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];

    const [displayName, setDisplayName] = useState(null);
    const [displayNameInput, setDisplayNameInput] = useState(null);
    const manageDisplayName = (val) => {
        if (!!val) {
            setDisplayName(val);
        } else {
            setDisplayName(profile.displayName);
        }
        setDisplayNameInput(null);
    }

    const [email, setEmail] = useState(null);
    const [emailInput, setEmailInput] = useState(null);
    const manageEmail = (val) => {
        if (!!val) {
            setEmail(val);
        } else {
            setEmail(profile.email);
        }
        setEmailInput(null);
    }

    useEffect(() => {
        setDisplayName(profile.isAnonymous ?
            'Mysterious User' :
            profile.displayName);
        setEmail(profile.isAnonymous ?
            'Mysterious Email' :
            profile.email)
        return () => {

        };
    }, [profile]);
    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
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
                <MaxWidthContent>
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
                        <IonItem >
                            <IonLabel position="floating">{displayName}</IonLabel>
                            <IonInput
                                value={displayNameInput}
                                onBlur={(ev) => {
                                    manageDisplayName(ev.currentTarget.value);
                                }}
                                onFocus={() => {
                                    if (displayName !== profile.displayName)
                                        setDisplayNameInput(displayName)
                                }}
                            ></IonInput>
                        </IonItem>
                        <IonItem >
                            <IonLabel position="floating">{email}</IonLabel>
                            <IonInput
                                value={emailInput}
                                onBlur={(ev) => {
                                    manageEmail(ev.currentTarget.value);
                                }}
                                onFocus={() => {
                                    if (email !== profile.email)
                                        setEmailInput(email)
                                }}
                            ></IonInput>
                        </IonItem>
                    </IonCard>
                </MaxWidthContent>
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
