import { MODAL_OPEN, MODAL_CLOSE } from '../actionTypes';

const initialState = {
    showModal: false
}

const openModal = state => {
    return { ...state, showModal: true };
};

const closeModal = state => {
    return { ...state, showModal: false };
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case MODAL_OPEN:
            return openModal(state);

        case MODAL_CLOSE:
            return closeModal(state);

        default:
            return state;
    }
};