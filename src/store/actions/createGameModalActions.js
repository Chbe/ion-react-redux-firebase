import { MODAL_OPEN, MODAL_CLOSE } from '../actionTypes';

export const openModal = () => (dispatch) => {
    dispatch({ type: MODAL_OPEN, payload: true });
};

export const closeModal = () => (dispatch) => {
    dispatch({ type: MODAL_CLOSE, payload: false });
};