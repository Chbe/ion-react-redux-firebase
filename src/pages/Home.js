import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { happy, add, mail, close, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonCard,
  IonList,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText,
  IonLabel,
  IonModal,
  IonItemSliding,
  IonItemOption,
  IonItemOptions
} from '@ionic/react';
import CreateGameModal from '../components/CreateGameModal';

const sceletonCard = (<IonCard key='1'>
  <IonCardHeader>
    <IonCardSubtitle>
      <IonSkeletonText animated style={{ width: '10%' }} />
    </IonCardSubtitle>
    <IonCardTitle style={{ textAlign: 'center' }}>
      <IonSkeletonText animated style={{ width: '20%%' }} />
    </IonCardTitle>
  </IonCardHeader>

  <IonCardContent>
    <IonSkeletonText animated style={{ width: '40%%' }} />
  </IonCardContent>
</IonCard>);

const Home = ({ games, uid, history }) => {

  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={(ev) => {
                ev.preventDefault();
                history.push('/profile');
              }}>
              <IonIcon slot="start" icon={happy}></IonIcon>
              <IonLabel>Profile</IonLabel>
            </IonButton>
          </IonButtons>

          <IonButtons slot="end">
            <IonButton onClick={() => setShowModal(true)}>
              <IonLabel>New</IonLabel>
              <IonIcon slot="end" icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}>
          <IonItem style={{ width: '6em' }} onClick={() => setShowModal(false)}>
            <IonIcon slot='start' icon={close}></IonIcon>
          </IonItem>
          <CreateGameModal />
          <IonButton onClick={() => setShowModal(false)}>CREATE GAME</IonButton>
        </IonModal>

        {games && games.map(invite => {
          if (!invite.acceptedInvites.includes(uid))
            return <IonItemSliding key={invite.id}>
              <IonItem>
                <IonIcon slot="start" icon={mail}></IonIcon>
                <IonLabel>
                  <h2>New Invite</h2>
                  <p>From {invite.players.find(player =>
                    player.uid === invite.admin)
                    .displayName}</p>
                </IonLabel>
              </IonItem>
              <IonItemOptions side='start'>
                <IonItemOption
                  expandable
                  color='danger'
                  onClick={() => console.log('Reject Invite')}
                >
                  <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
                  Reject
                  </IonItemOption>
              </IonItemOptions>
              <IonItemOptions side='end'>
                <IonItemOption
                  expandable
                  color='success'
                  onClick={() => console.log('Accept Invite')}
                >
                  <IonIcon slot="end" icon={checkmarkCircleOutline}></IonIcon>
                  Accept
                  </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
        })}

        {games ?
          <IonList>
            {games.map(game => {
              if (game.acceptedInvites.includes(uid)) {
                // Status active or pending
                return <IonCard
                  key={game.id}
                  // href='/game'
                  onClick={() => { // TODO: Only for dev. Remove.
                    console.log(game)
                  }}
                >
                  <IonCardHeader>
                    <IonCardSubtitle>
                      {game.status === 'pending' ? game.status : game.activePlayer}
                    </IonCardSubtitle>
                    <IonCardTitle
                      style={{
                        textAlign: 'center'
                      }}
                    >{game.title}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {(new Date(game.lastUpdated)).toString()}
                  </IonCardContent>
                </IonCard>
              }
            })}
          </IonList> : sceletonCard
        }
      </IonContent>
    </>
  )
}

const mapStateToProps = ({ firebase, firestore }) => ({
  uid: firebase.auth.uid,
  games: firestore.ordered.games
});

export default compose(
  //withRouter, if you use react router to redirect
  firestoreConnect(props => [{
    collection: 'games',
    where: [
      ['playersUid', 'array-contains',
        {
          uid: props.firebase.auth().currentUser.uid
        }
      ]
    ],
    orderBy: [
      ['status', 'asc'],
      ['lastUpdated', 'desc']
    ]
  }]),
  connect(mapStateToProps)
)(Home)