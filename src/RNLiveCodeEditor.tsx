import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RNLiveCodeContext } from "./RNLiveCodeProvider";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import * as Babel from "@babel/standalone";

export type RNLiveCodeEditorProps = {
  width?: string;
  height?: string;
  theme?: 'dark' | 'light';
  onCodeChange?: (code: string) => void;
  showTranspiled: boolean;
}

export const RNLiveCodeEditor: React.FC<RNLiveCodeEditorProps> = ({ width, height, theme, onCodeChange, showTranspiled }) => {
  const { context, dispatch } = useContext(RNLiveCodeContext);
  const savedCode = useRef(context.code);
  const [transpiledCode, setTranspiledCode] = useState<undefined | string>(undefined);

  useEffect(() => {
    if (showTranspiled) {
      let transpiled = Babel.transform(
        savedCode.current,
        {
          presets: ['env', 'react', [
            'typescript',
            { allExtensions: true, isTSX: true, jsxPragma: 'React', jsxPragmaFrag: 'React.Fragment' }
          ]]
        }
      ).code

      console.log(transpiled);
      setTranspiledCode(transpiled);
    } else {
      setTranspiledCode(undefined);
    }
  }, [showTranspiled]);

  const onChange = useCallback((code) => {
    if (showTranspiled) {
      return;
    }

    savedCode.current = code;
    onCodeChange?.(code);
    dispatch({ type: 'editing', code })
  }, []);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'flex-start',
      fontSize: '16px',
    }}>
      <CodeMirror
        readOnly={showTranspiled}
        value={transpiledCode ?? context.code}
        width={width ?? '600px'}
        height={height ?? '549px'}
        theme={theme === 'dark' ? okaidia : quietlight}
        extensions={[okaidia, quietlight, javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
};

