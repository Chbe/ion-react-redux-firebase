import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { happy, add, mail, close, checkmarkCircleOutline, closeCircleOutline, arrowDropleft } from 'ionicons/icons';
import {
  IonButtons,
  IonContent,
  IonHeader,
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
  IonLabel,
  IonModal,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonRippleEffect
} from '@ionic/react';
import CreateGameModal from '../components/game/create-game/CreateGameModal';
import { useFirestore } from 'react-redux-firebase';
import styled from 'styled-components';
import SkeletonGames from '../components/skeletons/SkeletonGames';
import { FlexboxCenter } from '../components/UI/DivUI';
import { createGameCleanUp } from '../store/actions';

// TODO: hehe some design focus maybe?
const ActivePendingGame = styled(IonCard)`
  // box-shadow: 0 4px 16px ${({ boxShadow }) => (boxShadow)};
`;

const ModalHeader = styled(FlexboxCenter)`
  width: 35px;
  height: 35px;
  font-size: 1.5rem;
`;

const appendZero = (value) => {
  return value < 10 ? `0${value}` : value;
}

const formatDate = (date) => {
  const current_datetime = new Date(date);
  const formatted_date =
    `${current_datetime.getFullYear()}-${appendZero((current_datetime.getMonth() + 1))}-${appendZero(current_datetime.getDate())} ${current_datetime.getHours()}:${current_datetime.getMinutes()}`
  return formatted_date;
}

const Home = ({ games, profile, history, gameTitle, gameInvites, cleanUp }) => {
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
        title: gameTitle,
        scoreboard: [
          ...gameInvites.map(u => {
            return {
              ...u,
              score: 0
            }
          }),
          { uid, displayName, photoURL, score: 0 }
        ]
      };

      firestore
        .collection('games')
        .add(newGame);

      toggleModal(false);
    }
  }

  const toggleModal = (bool) => {
    setShowModal(bool);
    if (!bool)
      cleanUp();
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
            <IonButton onClick={() => toggleModal(true)}>
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
          // TODO: onDidDismiss is causing couble action dispath
          onDidDismiss={() => toggleModal(false)}>
          <ModalHeader onClick={() => toggleModal(false)}>
            <IonRippleEffect></IonRippleEffect>
            <IonIcon slot='start' icon={close}></IonIcon>
          </ModalHeader>
          <IonContent>
            <CreateGameModal />
          </IonContent>
          <IonButton onClick={createGame}>CREATE GAME</IonButton>
        </IonModal>

        {/* Invites  */}
        {games && <IonList> {games.map(invite => {
          if (!invite.acceptedInvites.includes(profile.uid))
            return <IonItemSliding key={invite.id}>
              <IonItem detail detailIcon={arrowDropleft}>
                <IonIcon slot="start" icon={mail}></IonIcon>
                <IonLabel>
                  <h2>New Invite</h2>
                  <p>from {invite.players.find(player =>
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
        })}</IonList>}

        {/* Active or pending games */}
        {games
          ?
          <IonList>
            {games.map(game => {
              if (game.acceptedInvites.includes(profile.uid)) {
                // Status active or pending
                const boxShadow = game.activePlayer.uid === profile.uid
                  ? 'var(--ion-color-success)'
                  : 'rgba(0,0,0,.12)'
                const href = game.status === 'active' ? `/game/${game.id}` : `/chat/${game.id}`;
                return <ActivePendingGame
                  boxShadow={boxShadow}
                  key={game.id}
                  onclick={(e) => {
                    e.preventDefault();
                    history.push(href);
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
                </ActivePendingGame>
              }
            })}
          </IonList>
          : <SkeletonGames />
        }

      </IonContent>
    </>
  )
}

const mapStateToProps = ({ firebase, firestore, createGameReducer }) => ({
  profile: firebase.profile,
  games: firestore.ordered.games,
  gameTitle: createGameReducer.title,
  gameInvites: createGameReducer.invites
});

const mapDispatchToProps = {
  cleanUp: createGameCleanUp
};

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
  connect(mapStateToProps, mapDispatchToProps)
)(Home)