import * as ReactNative from 'react-native-web';
import * as ReactScope from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import * as Babel from "@babel/standalone";
import React, { useContext, useMemo, Component, ReactNode } from 'react';
import { LiveCodeState, RNLiveCodeContext } from "./RNLiveCodeProvider";

const rnKeys = Object.keys(ReactNative)
const reactKeys = Object.keys(ReactScope).filter((el) => el !== 'default');

const allKeys = rnKeys.concat(reactKeys).concat(['Icon']);

const scopeValues = rnKeys.map((key) => ReactNative[key]).
    concat(reactKeys.map((key) => ReactScope[key])).
    concat([Icon]);

let requireAlias = () => ReactNative;

export const Renderer = () => {
    const { context, dispatch } = useContext(RNLiveCodeContext);

    const Component = useMemo(() => {
        try {
            const code = context.code;
            if (!code) { return null; }
            let exports = {};
            let transpiled = Babel.transform(
                code,
                {
                    presets: ['env', 'react', [
                        'typescript',
                        { allExtensions: true, isTSX: true, jsxPragma: 'React', jsxPragmaFrag: 'React.Fragment' }
                    ]]
                }
            ).code;

            new Function(
                'React',
                'exports',
                'require',
                ...allKeys,
                transpiled
            )(React, exports, requireAlias, ...scopeValues);

            return (exports as any).default;
        } catch (error) {
            dispatch({ type: 'error', error })
        }

        return null;
    }, [context.code]);

    return Component ? <Component /> : null;
}

interface ErrorBoundaryProps {
    context: LiveCodeState;
    dispatch: any;
    children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps> {
    constructor(props) {
        super(props);
    }

    componentDidCatch(error, errorInfo) {
        this.props.dispatch({ type: 'error', error })
    }

    render() {
        if (this.props.context.errored) {
            return (
                <div style={{ flex: 1, background: 'red' }}>
                    <p>{this.props.context.errored.toString()}</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export interface RNLiveCodeRendererProps {
    width?: string;
    height?: string;
}

export const RNLiveCodeRenderer = ({ width, height }: RNLiveCodeRendererProps) => {
    const { context, dispatch } = useContext(RNLiveCodeContext);

    return (
        <div style={{
            width: width ?? '285px',
            height: height ?? '549px',
            background: '#ffffff',
        }}>
            <ErrorBoundary context={context} dispatch={dispatch}>
                <Renderer />
            </ErrorBoundary>
        </div>
    );
}