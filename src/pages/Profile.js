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

const Profile = ({ profile, firebase }) => {
    return (
        <>
            <IonHeader>
                <IonToolbar>
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
                <IonCard style={{ '--background': 'var(--ion-color-primary)' }}>
                    <IonItem>
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
    connect((mapStateToProps))
)(Profile)
