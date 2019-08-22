import {
    GAME_SET_CLEANUP,
    GAME_SET_LETTER,
    GAME_SET_LOADING,
    GAME_SET_LETTERS_ARRAY
} from '../actionTypes';

const initialState = {
    letter: '',
    enablePlay: false,
    lettersArray: []
}

const cleanUp = state => {
    return { ...state, letter: '', enablePlay: false, lettersArray: [] }
}

const setLetter = (state, payload) => {
    return { ...state, letter: payload };
};

const setEnablePlay = (state, payload) => {
    return { ...state, enablePlay: payload };
};

const setLettersArray = (state, payload) => {
    return { ...state, lettersArray: payload };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GAME_SET_CLEANUP:
            return cleanUp(state);

        case GAME_SET_LETTER:
            return setLetter(state, payload);

        case GAME_SET_LOADING:
            return setEnablePlay(state, payload);

        case GAME_SET_LETTERS_ARRAY:
            return setLettersArray(state, payload);

        default:
            return state;
    }
};