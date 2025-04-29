import React, { useReducer, createContext, Dispatch } from "react";

export interface LiveCodeState {
    code: string;
    errored: boolean;
}

type LiveCodeAction =
    | { type: 'editing'; code: string; }
    | { type: 'error'; error: Error };

const initialState: LiveCodeState = {
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

export const RNLiveCodeContext = createContext<{
    context: LiveCodeState;
    dispatch: Dispatch<LiveCodeAction>;
}>({ context: initialState, dispatch: () => null });

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

