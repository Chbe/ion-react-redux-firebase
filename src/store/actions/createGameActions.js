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