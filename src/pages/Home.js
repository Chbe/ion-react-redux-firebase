import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { happy, add, close } from 'ionicons/icons';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonList,
  IonLabel,
  IonModal,
  IonRippleEffect,
  IonFooter
} from '@ionic/react';
import CreateGameModal from '../components/game/create-game/CreateGameModal';
import { useFirestore } from 'react-redux-firebase';
import styled from 'styled-components';
import SkeletonGames from '../components/skeletons/SkeletonGames';
import { FlexboxCenter } from '../components/UI/DivUI';
import { createGameCleanUp } from '../store/actions';
import GameCard from '../components/game/GameCard';
import GameInvite from '../components/game/GameInvite';

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
                return <GameInvite
                  key={invite.id}
                  invite={invite}
                  uid={profile.uid}
                  firestore={firestore}
                />
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
                    uid={profile.uid}
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