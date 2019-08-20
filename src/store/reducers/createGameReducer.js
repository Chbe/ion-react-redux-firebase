import { GAME_SET_TITLE, GAME_SET_INVITES } from '../actionTypes';

const initialState = {
    title: '',
    invites: []
}

const setTitle = (state, payload) => {
    return { ...state, title: payload };
};
const setInvites = (state, payload = []) => {
    return { ...state, invites: payload };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GAME_SET_TITLE:
            return setTitle(state, payload);

        case GAME_SET_INVITES:
            return setInvites(state, payload);

        default:
            return state;
    }
};