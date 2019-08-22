import {
    GAME_SET_LETTER,
    GAME_SET_LOADING
} from '../actionTypes';

export const setLetter = (letter) => (dispatch) => {
    dispatch({ type: GAME_SET_LETTER, payload: letter });
};

export const setEnablePlay = (bool) => (dispatch) => {
    dispatch({ type: GAME_SET_LOADING, payload: bool });
};