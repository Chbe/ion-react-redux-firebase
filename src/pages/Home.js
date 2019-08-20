import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { happy, add, mail, close, checkmarkCircleOutline, closeCircleOutline, arrowDropleft } from 'ionicons/icons';
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
  IonItemOptions,
  IonRippleEffect
} from '@ionic/react';
import CreateGameModal from '../components/CreateGameModal';
import { useFirestore } from 'react-redux-firebase'

const appendZero = (value) => {
  return value < 10 ? `0${value}` : value;
}

const formatDate = (date) => {
  const current_datetime = new Date(date);
  const formatted_date =
    `${current_datetime.getFullYear()}-${appendZero((current_datetime.getMonth() + 1))}-${appendZero(current_datetime.getDate())} ${current_datetime.getHours()}:${current_datetime.getMinutes()}`
  return formatted_date;
}
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

const Home = ({ games, profile, history, gameTitle, gameInvites }) => {
  const firestore = useFirestore();
  const [showModal, setShowModal] = useState(false);
  const uids = gameInvites.map(player => {
    return { uid: player.uid }
  });

  const createGame = () => {
    if (!!gameTitle.length && !!gameInvites.length) {
      const { uid, displayName, photoURL } = profile;
      const newGame = {
        acceptedInvites: [uid],
        activePlayer: {},
        admin: uid,
        lastUpdated: Date.now(),
        players: [...gameInvites, { uid, displayName, photoURL }],
        playersUid: [...uids, { uid }],
        status: "pending",
        title: gameTitle
      };

      firestore
        .collection('games')
        .add(newGame);

      setShowModal(false);
    }
  }

  // TODO: Filter different list for invites, users turn, active and pending. In that order.
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

        {/* Create game modal */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}>
          <div style={{
            width: '35px',
            height: '35px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.5rem'
          }} onClick={() => setShowModal(false)}>
            <IonRippleEffect></IonRippleEffect>
            <IonIcon slot='start' icon={close}></IonIcon>
          </div>
          <CreateGameModal />
          <IonButton onClick={createGame}>CREATE GAME</IonButton>
        </IonModal>

        {/* Invites  */}
        {games && games.map(invite => {
          if (!invite.acceptedInvites.includes(profile.uid))
            return <IonItemSliding key={invite.id}>
              <IonItem detail detailIcon={arrowDropleft}>
                <IonIcon slot="start" icon={mail}></IonIcon>
                <IonLabel>
                  <h2>New Invite</h2>
                  <p>{invite.players.find(player =>
                    player.uid === invite.admin)
                    .displayName} invited you to the game {invite.title}<br />
                    {formatDate(invite.lastUpdated)}</p>
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

        {/* Active or pending games */}
        {games ?
          <IonList>
            {games.map(game => {
              if (game.acceptedInvites.includes(profile.uid)) {
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
                      {game.status === 'pending' ?
                        game.status :
                        game.activePlayer.uid === profile.uid ?
                          'Your turn' :
                          game.activePlayer.displayName
                      }
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
              }
            })}
          </IonList> : sceletonCard
        }
      </IonContent>
    </>
  )
}

const mapStateToProps = ({ firebase, firestore, createGame }) => ({
  profile: firebase.profile,
  games: firestore.ordered.games,
  gameTitle: createGame.title,
  gameInvites: createGame.invites
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