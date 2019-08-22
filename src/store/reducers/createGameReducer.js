import {
    CREATE_GAME_SET_TITLE,
    CREATE_GAME_SET_INVITES,
    CREATE_GAME_CLEANUP
} from '../actionTypes';

const initialState = {
    title: '',
    invites: [],
    error: null,
    loading: false,
}

const cleanUp = (state) => {
    console.log('clean')
    return { ...state, ...initialState };
};
const setTitle = (state, payload) => {
    return { ...state, title: payload };
};

const setInvites = (state, payload = []) => {
    return { ...state, invites: payload };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CREATE_GAME_CLEANUP:
            return cleanUp(state);

        case CREATE_GAME_SET_TITLE:
            return setTitle(state, payload);

        case CREATE_GAME_SET_INVITES:
            return setInvites(state, payload);

        default:
            return state;
    }
};