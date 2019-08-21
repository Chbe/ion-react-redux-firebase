import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import createGameReducer from './createGameReducer';
import gameReducer from './gameReducer';

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore,
    createGameReducer: createGameReducer,
    gameReducer: gameReducer
})

export default rootReducer;