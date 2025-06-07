import * as ReactNative from 'react-native-web';
import * as ReactScope from 'react';
import Icon from '@react-native-vector-icons/ionicons';
import * as Babel from "@babel/standalone";
import React, { useContext, useMemo, Component, ReactNode, useCallback } from 'react';
import { LiveCodeState, RNLiveCodeContext } from "./RNLiveCodeProvider";
import * as ReactNavigationStackScope from '@react-navigation/stack';
import * as ReactNavigationTabScope from '@react-navigation/bottom-tabs';
import * as ReactNavigationScope from '@react-navigation/native';

const rnKeys = Object.keys(ReactNative)
const reactKeys = Object.keys(ReactScope).filter((el) => el !== 'default');
const reactNavigationKeys = Object.keys(ReactNavigationScope).filter((el) => el !== 'default');
const reactNavigationStackKeys = Object.keys(ReactNavigationStackScope).filter((el) => el !== 'default');
const reactNavigationTabKeys = Object.keys(ReactNavigationTabScope).filter((el) => el !== 'default' && reactNavigationStackKeys.indexOf(el) < 0);

const allKeys = rnKeys.concat(reactKeys)
    .concat(['Icon'])
    .concat(reactNavigationKeys)
    .concat(reactNavigationStackKeys)
    .concat(reactNavigationTabKeys);

let requireAlias = () => ReactNative;

export type RNRendererProps = {
    loopDetector: boolean;
    theme?: 'dark' | 'light';
}

export const Renderer = ({ loopDetector, theme }: RNRendererProps) => {
    const { context, dispatch } = useContext(RNLiveCodeContext);

    const overriddenUseColorScheme = useCallback(() => {
        return theme ?? null;
    }, [theme])

    const Component = useMemo(() => {
        try {
            const scopeValues = rnKeys.map((key) => {
                if (key === 'useColorScheme') {
                    return overriddenUseColorScheme;
                } else {
                    return ReactNative[key];
                }
            })
                .concat(reactKeys.map((key) => ReactScope[key]))
                .concat([Icon])
                .concat(reactNavigationKeys.map((key) => ReactNavigationScope[key]))
                .concat(reactNavigationStackKeys.map((key) => ReactNavigationStackScope[key]))
                .concat(reactNavigationTabKeys.map((key) => ReactNavigationTabScope[key]));

            const code = context.code;
            if (!code) { return null; }
            let exports: any = {};
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

            return loopDetector ? proxyModule(exports.default) : exports.default;
        } catch (error) {
            dispatch({ type: 'error', error })
        }

        return null;
    }, [context.code, overriddenUseColorScheme]);

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
                <div style={{ display: 'flex', flex: 1, background: 'red' }}>
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
    loopDetector?: boolean;
    theme?: 'dark' | 'light';
}


interface Handler {
    get?: Function;
    set?: Function;
    apply?: Function;
    construct?: Function;
}

interface ProxyConstructor {
    revocable<T extends object>(target: T, handler: Handler): { proxy: T; revoke: () => void; };
    new <T extends object>(target: T, handler: Handler): T;
}
declare var Proxy: ProxyConstructor;

const proxyModule = (module) => {
    let count = 0;
    let lastTimeCalled = undefined;

    return new Proxy(module, {
        apply(val, thisArg, args) {
            const now = Date.now();
            if (!lastTimeCalled) {
                lastTimeCalled = now;
                count = 1;
                return val.apply(this, args);
            }

            const diff = now - lastTimeCalled;
            if (diff <= 1000 && count > 300) {
                throw new Error(`Infinite loop in ${module.name}`);
            } else if (diff > 1000) {
                lastTimeCalled = now;
                count = 1;
            } else {
                count += 1;
            }

            return val.apply(thisArg, args);
        },
        construct(target, args) {
            return new Proxy(new target(...args), {
                get(target, prop, receiver) {
                    const val = target[prop];
                    if (typeof val === 'function' && (prop) === 'render') {
                        return function (...args) {
                            const now = Date.now();
                            if (!lastTimeCalled) {
                                lastTimeCalled = now;
                                count = 1;
                                return val.apply(this, args);
                            }

                            const diff = now - lastTimeCalled;
                            if (diff <= 1000 && count > 300) {
                                throw new Error(`Infinite loop in ${name}`);
                            } else if (diff > 1000) {
                                lastTimeCalled = now;
                                count = 1;
                            } else {
                                count += 1;
                            }

                            return val.apply(this, args);
                        }
                    } else {
                        return val;
                    }
                },
            })
        }
    });
}

export const RNLiveCodeRenderer = ({ width, height, loopDetector, theme }: RNLiveCodeRendererProps) => {
    const { context, dispatch } = useContext(RNLiveCodeContext);

    return (
        <div style={{
            width: width ?? '285px',
            height: height ?? '549px',
            display: 'flex',
            background: '#ffffff',
        }}>
            <ErrorBoundary context={context} dispatch={dispatch}>
                <Renderer loopDetector={loopDetector} theme={theme} />
            </ErrorBoundary>
        </div >
    );
};