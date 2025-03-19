import React, { useCallback, useState, useContext } from "react";
import { RNLiveCodeContext } from "./RNLiveCodeProvider";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

export const RNLiveCodeEditor = ({ width, height, theme, onCodeChange }) => {
  const { context, dispatch } = useContext(RNLiveCodeContext);

  const onChange = useCallback((code) => {
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
        value={context.code}
        width={width ?? '600px'}
        height={height ?? '549px'}
        theme={theme ?? okaidia}
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
};

