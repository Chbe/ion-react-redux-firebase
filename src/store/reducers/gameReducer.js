import {
    GAME_SET_LETTER
} from '../actionTypes';

const initialState = {
    letter: ''
}

const setLetter = (state, payload) => {
    return { ...state, letter: payload };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GAME_SET_LETTER:
            return setLetter(state, payload);

        default:
            return state;
    }
};