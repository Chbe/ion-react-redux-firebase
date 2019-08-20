import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import thunk from 'redux-thunk';
import { useFirestore } from 'react-redux-firebase'

const initialState = {};
const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(thunk.withExtraArgument({ useFirestore })),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

export default store;