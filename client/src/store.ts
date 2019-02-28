import { createStore, combineReducers, Action } from 'redux';

const initialState = {};
const ACTION = 'action';
interface DummyAction extends Action {
    payload: () => void;
}

function dummyReducer(state = initialState, action: DummyAction) {
    switch(action.type) {
        case ACTION:
            return action.payload;
        default:
            return state;
    }
}

const dummyApp = combineReducers({
    dummyReducer
});

export default createStore(dummyApp);
