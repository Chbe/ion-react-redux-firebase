import {
    CREATE_GAME_CLEANUP,
    CREATE_GAME_SET_TITLE,
    CREATE_GAME_SET_INVITES
} from '../actionTypes';

export const createGameCleanUp = () => ({
    type: CREATE_GAME_CLEANUP,
});

export const setTitle = (title) => (dispatch) => {
    dispatch({ type: CREATE_GAME_SET_TITLE, payload: title });
};

export const setInvites = (invitesArr) => (dispatch) => {
    dispatch({ type: CREATE_GAME_SET_INVITES, payload: invitesArr });
};