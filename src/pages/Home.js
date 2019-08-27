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
  IonRippleEffect,
  IonFooter,
  IonListHeader
} from '@ionic/react';
import CreateGameModal from '../components/game/create-game/CreateGameModal';
import { useFirestore } from 'react-redux-firebase';
import styled from 'styled-components';
import SkeletonGames from '../components/skeletons/SkeletonGames';
import { FlexboxCenter } from '../components/UI/DivUI';
import { createGameCleanUp } from '../store/actions';
import GameCard from '../components/game/GameCard';

const ModalHeader = styled(FlexboxCenter)`
  width: 35px;
  height: 35px;
  font-size: 1.5rem;
`;

const NoGamesWrapper = styled(FlexboxCenter)`
  width: 100%;
  height: 90%;
`;

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
        playersUid: [...uids, { uid }],
        players: [
          ...gameInvites,
          {
            uid,
            displayName,
            photoURL,
            score: 0,
            isActive: true
          }
        ],
        // playersUid: [...uids, { uid }],
        status: "pending",
        title: gameTitle
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

  const answerInvite = (game, accept) => {
    if (accept) {
      // TODO: Check if game can start
      const acceptedInvites = [...game.acceptedInvites, profile.uid];
      firestore.update(`games/${game.id}`, {
        acceptedInvites,
        ...startGame(game.status, game.players, game.admin, acceptedInvites)
      });
    } else {
      // TODO: Check if game shall start or cancel
      const playersUid = [...game.playersUid.filter(p => p.uid !== profile.uid)];
      if (playersUid.length === 1) {
        firestore.delete(`games/${game.id}`);
      } else {
        firestore.update(`games/${game.id}`, {
          players: [...game.players.filter(p => p.uid !== profile.uid)],
          playersUid,
          ...startGame(game.status, game.players, game.admin, playersUid)
        });
      }
    }
  }

  const startGame = (status, players, admin, acceptedInvites) => {
    return acceptedInvites.length === players.length
      ? { status: 'active', activePlayer: players.find(p => p.uid === admin) }
      : { status }
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
          <IonFooter className="ion-padding">
            <IonToolbar>
              <IonButton
                expand="full"
                size="large"
                color="success"
                onClick={createGame}>CREATE GAME</IonButton>
            </IonToolbar>
          </IonFooter>
        </IonModal>

        {/* Invites  */}
        <IonList>
          {games && games
            .map(invite => {
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
                      onClick={(ev) => {
                        ev.preventDefault();
                        answerInvite(invite, false);
                      }}
                    >
                      <IonIcon slot="start" icon={closeCircleOutline}></IonIcon>
                      Reject
                  </IonItemOption>
                  </IonItemOptions>
                  <IonItemOptions side='end'>
                    <IonItemOption
                      expandable
                      color='success'
                      onClick={(ev) => {
                        ev.preventDefault();
                        answerInvite(invite, true);
                      }}
                    >
                      <IonIcon slot="end" icon={checkmarkCircleOutline}></IonIcon>
                      Accept
                  </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
            })
          }
        </IonList>

        {/* Active or pending games */}
        <IonList>
          {games
            ? games.length
              ? games.map(game => {
                if (game.acceptedInvites.includes(profile.uid)) {    
                  return <GameCard
                    key={game.id}
                    game={game}
                    history={history}
                  />
                }
              })
              : <NoGamesWrapper>
                <IonButton
                  expand="block"
                  fill="outline"
                  size="large"
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggleModal(true);
                  }}
                >
                  <IonIcon slot="end" icon={add} />
                  <IonLabel>New Game</IonLabel>
                </IonButton>
              </NoGamesWrapper>
            : <SkeletonGames />
          }
        </IonList>

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