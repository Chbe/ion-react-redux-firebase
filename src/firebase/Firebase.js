import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { fbConfig } from '../config/Configs';

const config = {
    ...fbConfig
};

firebase.initializeApp(config);
firebase.firestore();
// firebase.functions() // <- needed if using httpsCallable

export default firebase;