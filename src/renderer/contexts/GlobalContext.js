import React from 'react';
import initialState from '../store';
import GlobalReducer from "../reducers/GlobalReducer";

export const GlobalContext = React.createContext(initialState);

export const GlobalProvider = ({children}) => {
    const [globalState, dispatch] = React.useReducer(GlobalReducer, initialState);

    return (
        <GlobalContext.Provider value={[globalState, dispatch]}>
            {children}
        </GlobalContext.Provider>
    )
};
