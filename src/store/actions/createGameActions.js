import {
    GAME_SET_TITLE,
    GAME_SET_INVITES,
    CREATE_GAME_START,
    CREATE_GAME_SUCCESS,
    CREATE_GAME_FAIL
} from '../actionTypes';

export const setTitle = (title) => (dispatch) => {
    dispatch({ type: GAME_SET_TITLE, payload: title });
};

export const setInvites = (invitesArr) => (dispatch) => {
    dispatch({ type: GAME_SET_INVITES, payload: invitesArr });
};

// Add a todo
export const createGame = data => async (dispatch, getState, { useFirestore }) => {
    const { uid, displayName, photoURL } = getState().firebase.profile;
    // const firestore = useFirestore();
    console.log(useFirestore)
    // dispatch({ type: CREATE_GAME_START });
    // try {
    //     const newGame = {
    //         acceptedInvites: [...data.invites],
    //         activePlayer: {},
    //         admin: uid,
    //         lastUpdated: Date.now(),
    //         players: [{ uid, displayName, photoURL }],
    //         playersUid: [{ uid }],
    //         status: "pending",
    //         title: data.title
    //     };

    //     firestore
    //         .collection('games')
    //         .set(newGame, { merge: true });

    //     dispatch({ type: CREATE_GAME_SUCCESS });
    //     return true;
    // } catch (err) {
    //     dispatch({ type: CREATE_GAME_FAIL, payload: err.message });
    // }
};