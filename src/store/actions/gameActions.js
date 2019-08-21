import {
    GAME_SET_LETTER
} from '../actionTypes';

export const setLetter = (letter) => (dispatch) => {
    dispatch({ type: GAME_SET_LETTER, payload: letter });
};