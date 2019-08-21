import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore
import App from './App';
import store from './store';
import firebase from './firebase/Firebase';

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
    // enableClaims: true // Get custom claims along with the profile
};

// react-redux-firebase props
const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
};

// Setup react-redux so that connect HOC can be used
const Rend = () => (
    <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
            <Router>
                <App />
            </Router>
        </ReactReduxFirebaseProvider>
    </Provider>
);

render(<Rend />, document.getElementById('root'));