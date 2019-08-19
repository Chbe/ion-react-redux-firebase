import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import createGameModalReducer from './createGameModalReducer';

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer, // <- needed if using firestore,
    createGameModal: createGameModalReducer
})

export default rootReducer;