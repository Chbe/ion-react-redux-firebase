import {
    GAME_SET_LETTER,
    GAME_SET_LOADING
} from '../actionTypes';

const initialState = {
    letter: '',
    loading: false
}

const setLetter = (state, payload) => {
    return { ...state, letter: payload };
};

const setLoading = (state, payload) => {
    return { ...state, loading: payload };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GAME_SET_LETTER:
            return setLetter(state, payload);

        case GAME_SET_LOADING:
            return setLoading(state, payload);

        default:
            return state;
    }
};