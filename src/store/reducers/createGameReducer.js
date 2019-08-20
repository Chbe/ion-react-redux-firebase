import {
    GAME_SET_TITLE,
    GAME_SET_INVITES,
    CREATE_GAME_START,
    CREATE_GAME_SUCCESS,
    CREATE_GAME_FAIL
} from '../actionTypes';

const initialState = {
    title: '',
    invites: [],
    error: null,
    loading: false,
}

const setTitle = (state, payload) => {
    return { ...state, title: payload };
};

const setInvites = (state, payload = []) => {
    return { ...state, invites: payload };
};

const createGameStart = (state) => {
    return { ...state, loading: true };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GAME_SET_TITLE:
            return setTitle(state, payload);

        case GAME_SET_INVITES:
            return setInvites(state, payload);

        case CREATE_GAME_START:
            return createGameStart(state);

        // case CREATE_GAME_SUCCESS:
        //     return { ...state, loading: false, error: false };

        // case CREATE_GAME_FAIL:
        //     return { ...state, loading: false, error: payload };

        default:
            return state;
    }
};