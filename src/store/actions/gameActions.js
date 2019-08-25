import {
    IN_GAME_CLEANUP,
    IN_GAME_SET_LETTER,
    IN_GAME_SET_LOADING,
    IN_GAME_SET_LETTERS_ARRAY,
    IN_GAME_SET_SCOREBOARD
} from '../actionTypes';

export const inGameCleanUp = () => ({
    type: IN_GAME_CLEANUP,
});

export const setLetter = (letter) => (dispatch) => {
    dispatch({ type: IN_GAME_SET_LETTER, payload: letter });
};

export const setEnablePlay = (bool) => (dispatch) => {
    dispatch({ type: IN_GAME_SET_LOADING, payload: bool });
};

export const setLettersArray = (arr) => (dispatch) => {
    dispatch({ type: IN_GAME_SET_LETTERS_ARRAY, payload: arr });
};

export const setScoreboard = (scoreboard) => (dispatch) => {
    dispatch({ type: IN_GAME_SET_SCOREBOARD, payload: scoreboard });
};