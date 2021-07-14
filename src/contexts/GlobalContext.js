import React from 'react';
import {store as initialState} from '../store';
import {GlobalReducer as reducer} from "../reducers/GlobalReducer";

export const GlobalContext = React.createContext({
    state: initialState,
    dispatch: () => null
});

export const GlobalProvider = ({children}) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <GlobalContext.Provider value={[state, dispatch]}>
            {children}
        </GlobalContext.Provider>
    )
};
