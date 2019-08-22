import {
    GAME_SET_CLEANUP,
    GAME_SET_LETTER,
    GAME_SET_LOADING,
    GAME_SET_LETTERS_ARRAY
} from '../actionTypes';

export const cleanup = () => ({
    type: GAME_SET_CLEANUP,
});

export const setLetter = (letter) => (dispatch) => {
    dispatch({ type: GAME_SET_LETTER, payload: letter });
};

export const setEnablePlay = (bool) => (dispatch) => {
    dispatch({ type: GAME_SET_LOADING, payload: bool });
};

export const setLettersArray = (arr) => (dispatch) => {
    dispatch({ type: GAME_SET_LETTERS_ARRAY, payload: arr });
};