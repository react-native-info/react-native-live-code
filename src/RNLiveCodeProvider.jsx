import React, { useReducer, createContext, Dispatch } from "react";

const initialState = {
    code: '',
    errored: false
}

const reducer = (state, action) => {
    if (action.type === 'editing') {
        return {
            code: action.code,
            errored: false,
        };
    }
    if (action.type === 'error') {
        return {
            ...state,
            errored: action.error,
        };
    }
    throw Error('Unknown action.');
}

export const RNLiveCodeContext = createContext({ context: initialState, dispatch: () => null });

export const RNLiveCodeProvider = ({ children, defaultCode }) => {
    const [context, dispatch] = useReducer(reducer, { ...initialState, code: defaultCode });

    return (
        <RNLiveCodeContext.Provider value={{ context, dispatch }}>
            {children}
        </RNLiveCodeContext.Provider>
    );
};

