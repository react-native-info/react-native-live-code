import React, { useReducer, createContext } from "react";

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

export const RNLiveCodeContext = createContext();

export type RNLiveCodeProviderProps = {
    children: React.ReactNode;
    defaultCode: string;
}

export const RNLiveCodeProvider = ({ children, defaultCode }: RNLiveCodeProviderProps) => {
    const [context, dispatch] = useReducer(reducer, { ...initialState, code: defaultCode });

    return (
        <RNLiveCodeContext.Provider value={{ context, dispatch }}>
            {children}
        </RNLiveCodeContext.Provider>
    );
};

