import {
    GAME_SET_LETTER,
    GAME_SET_LOADING
} from '../actionTypes';

const initialState = {
    letter: '',
    enablePlay: false
}

const setLetter = (state, payload) => {
    return { ...state, letter: payload };
};

const setEnablePlay = (state, payload) => {
    return { ...state, enablePlay: payload };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GAME_SET_LETTER:
            return setLetter(state, payload);

        case GAME_SET_LOADING:
            return setEnablePlay(state, payload);

        default:
            return state;
    }
};