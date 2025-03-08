<p align="center">
  <a href="https://reactnative.info" target="_blank">
    <img style="width: 220px" alt="Powered by reactnative.info" src="./img/react-native-live-code-avatar.png" />
  </a>
</p>
<p align="center">
<strong>Live editing of React Native in browser</strong>
<br><br>

# react-native-live-code

**react-native-live-code** is an lightweighted React Native editor with live preview. it is ideal for quick UI component prototyping or educational purposes. The live editor supports TypeScript.

## Installation

```sh
npm install react-native-live-code
```

## Usage

**react-native-live-code** offers two UI components: `RNLiveCodeRenderer` and `RNLiveCodeEditor`. Additionally, RNLiveCodeProvider is required as a container for these components for communication of content and error in live editing.

```
...
    <div className="App-container">
      <RNLiveCodeProvider defaultCode={defaultCode}>
        <RNLiveCodeRenderer />
        <RNLiveCodeEditor />
      </RNLiveCodeProvider>
    </div>
...
```
