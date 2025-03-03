import { RNLiveCodeProvider, RNLiveCodeEditor, RNLiveCodeRenderer } from 'react-native-live-code';

import { defaultCode } from './defaultCode';

import './App.css';

function App() {
  return (
    <div className="App-container">
      <RNLiveCodeProvider defaultCode={defaultCode}>
        <RNLiveCodeRenderer />
        <RNLiveCodeEditor />
      </RNLiveCodeProvider>
    </div>
  );
}

export default App;
