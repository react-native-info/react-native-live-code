import React, { useCallback, useContext } from "react";
import { RNLiveCodeContext } from "./RNLiveCodeProvider";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { quietlight } from '@uiw/codemirror-theme-quietlight';

export type RNLiveCodeEditorProps = {
  width?: string;
  height?: string;
  theme?: string;
  onCodeChange?: (code: string) => void
}

export const RNLiveCodeEditor: React.FC<RNLiveCodeEditorProps> = ({ width, height, theme, onCodeChange }) => {
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
        theme={theme === 'dark' ? okaidia : quietlight}
        extensions={[okaidia, quietlight, javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
};

