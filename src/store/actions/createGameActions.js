import { GAME_SET_TITLE, GAME_SET_INVITES } from '../actionTypes';

export const setTitle = (title) => (dispatch) => {
    dispatch({ type: GAME_SET_TITLE, payload: title });
};

export const setInvites = (invitesArr) => (dispatch) => {
    dispatch({ type: GAME_SET_INVITES, payload: invitesArr });
};