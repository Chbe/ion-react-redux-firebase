import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { withHandlers } from 'recompose';
import { IonApp, IonPage, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, isEmpty, withFirebase, withFirestore } from 'react-redux-firebase';
import { StyledFirebaseAuth } from 'react-firebaseui';
import * as firebaseui from 'firebaseui';
import PropTypes from 'prop-types';
import './theme/index.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Profile from './pages/Profile';
import Game from './pages/Game';
import Chat from './pages/Chat';
import Loading from './pages/Loading';
import styled from 'styled-components';
import { FlexboxCenter } from './components/UI/DivUI';
import Scoreboard from './components/game/Scoreboard';
import TestGenerateGames from './test/TestGenerateGames';

const LoginWrapper = styled(FlexboxCenter)`
  height: 100vh;
`;

const App = ({ firebase, auth, addUserToDb, updateUserProfile }) => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonPage>
          {
            !isLoaded(auth)
              ? <Loading />
              : isEmpty(auth)
                ? <LoginWrapper>
                  <StyledFirebaseAuth
                    uiConfig={{
                      signInOptions: [
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
                        {
                          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
                        }
                      ],
                      callbacks: {
                        signInSuccessWithAuthResult: ({ additionalUserInfo, user }) => {
                          /** TODO: Because theres a bug.
                           *  https://github.com/prescottprue/react-redux-firebase/issues/621 */
                           console.log(additionalUserInfo, user)
                          if (additionalUserInfo.isNewUser) {
                            addUserToDb(user);
                          } else {
                            updateUserProfile(user);
                          }
                          return false;
                        },
                      },
                    }}
                    firebaseAuth={firebase.auth()}
                  />
                </LoginWrapper>
                : <IonRouterOutlet>
                  <Route path="/home" component={Home} exact />
                  <Route path="/profile" component={Profile} exact />
                  <Route path="/game/:gameId" component={Game} exact />
                  <Route path="/scoreboard/:gameId" component={Scoreboard} exact />
                  <Route path="/chat/:gameId" component={Chat} exact />
                  {/* Development */}
                  <Route path="/generategames" component={TestGenerateGames} exact />
                  <Route exact path="/" render={() => <Redirect to="/home" />} />
                </IonRouterOutlet>
          }
        </IonPage>
      </IonReactRouter>
    </IonApp>
  )
};

App.propTypes = {
  firebase: PropTypes.shape({
    handleRedirectResult: PropTypes.func.isRequired
  }),
  auth: PropTypes.object
};

const mapStateToProps = ({ firebase, }) => ({
  auth: firebase.auth
});

export default compose(
  withFirebase,
  withFirestore,
  withHandlers({
    addUserToDb: ({ firestore }) => (user) => {
      return firestore.set({
        collection: `users`,
        doc: user.uid
      }, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
          photoURL: user.photoURL,
          searchName: user.displayName
            ? user.displayName.toLowerCase()
            : user.displayName,
          friends: []
        })
    },
    updateUserProfile: ({ firestore }) => (user) => {
      /**
       * TODO: Be aware not to override profile values when
       * edit profile is developed
       */
      return firestore.update({
        collection: `users`,
        doc: user.uid
      }, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
          photoURL: user.photoURL,
          searchName: user.displayName
            ? user.displayName.toLowerCase()
            : user.displayName
        })
    }
  }),
  connect(mapStateToProps)
)(App)
