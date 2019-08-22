import {
    IN_GAME_CLEANUP,
    IN_GAME_SET_LETTER,
    IN_GAME_SET_LOADING,
    IN_GAME_SET_LETTERS_ARRAY
} from '../actionTypes';

const initialState = {
    letter: '',
    enablePlay: false,
    lettersArray: []
}

const cleanUp = state => {
    return { ...state, ...initialState}
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
        case IN_GAME_CLEANUP:
            return cleanUp(state);

        case IN_GAME_SET_LETTER:
            return setLetter(state, payload);

        case IN_GAME_SET_LOADING:
            return setEnablePlay(state, payload);

        case IN_GAME_SET_LETTERS_ARRAY:
            return setLettersArray(state, payload);

        default:
            return state;
    }
};