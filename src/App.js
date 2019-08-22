import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonPage, IonRouterOutlet, IonContent } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, isEmpty, withFirebase } from 'react-redux-firebase';
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

const LoginWrapper = styled(FlexboxCenter)`
  height: 100vh;
`;

const App = ({ firebase, auth }) => {
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
                        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                          firebase.handleRedirectResult(authResult).then(() => {
                            // history.push(redirectUrl); if you use react router to redirect
                          });
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
                  <Route path="/chat/:gameId" component={Chat} exact />
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
  connect(mapStateToProps)
)(App)
