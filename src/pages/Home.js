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
import { FlexboxCenter, MaxWidthWrapper, MaxWidthContent } from '../components/UI/DivUI';
import { createGameCleanUp } from '../store/actions';
import GameCard from '../components/game/GameCard';
import GameInvite from '../components/game/GameInvite';
import FinishedGameCard from '../components/game/FinishedGameCard';

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

  const determineVisuals = () => {
    if (!games) {
      return <SkeletonGames />
    } else {
      if (!games.length) {
        return renderNoGames();
      } else {
        return <>
          <IonList className="no-background">{renderInvites()}</IonList>
          <IonList>{renderActiveAndPendingGames()}</IonList>
          <IonList>{renderFinishedGames()}</IonList>
        </>
      }
    }
  }

  const renderInvites = () => {
    return games
      .filter(game => game.status !== 'completed'
        && game.players.find(p =>
          p.uid === profile.uid && p.accepted === false))
      .map(game => {
        return <GameInvite
          key={game.id}
          invite={game}
          uid={profile.uid}
          firestore={firestore}
        />
      })
  }

  const renderActiveAndPendingGames = () => {
    return games
      .filter(game => game.status !== 'completed'
        && game.players.find(p =>
          p.uid === profile.uid && p.accepted === true))
      .map(game => {
        return <GameCard
          key={game.id}
          game={game}
          history={history}
          uid={profile.uid}
        />
      })
  }

  const renderFinishedGames = () => {
    return games
      .filter(game => game.status === 'completed')
      .map(game => {
        return <FinishedGameCard
          key={game.id}
          game={game}
          history={history}
        />
      })
  }

  const renderNoGames = () => {
    return <NoGamesWrapper>
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
  }

  const createGame = () => {
    if (!!gameTitle.length && !!gameInvites.length) {
      const { uid, displayName, photoURL } = profile;
      const newGame = {
        activePlayer: "",
        admin: uid,
        lastUpdated: Date.now(),
        playersUid: [...gameInvites.map(player => player.uid), uid],
        players: [
          ...gameInvites,
          {
            uid,
            displayName,
            photoURL,
            score: 0,
            isActive: true,
            accepted: true
          }
        ],
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
        <IonToolbar color="primary">
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
        <MaxWidthWrapper>
          <MaxWidthContent>
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
            {determineVisuals()}
          </MaxWidthContent>
        </MaxWidthWrapper>
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
      ['playersUid',
        'array-contains',
        props.firebase.auth().currentUser.uid
      ]
    ],
    orderBy: [
      ['status', 'asc'],
      ['lastUpdated', 'desc']
    ]
  }]),
  connect(mapStateToProps, mapDispatchToProps)
)(Home)