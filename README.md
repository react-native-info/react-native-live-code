<p align="center">
  <a href="https://reactnative.info" target="_blank">
    <img style="width: 220px" alt="Powered by reactnative.info" src="./img/react-native-live-code-avatar.png" />
  </a>
</p>
<p align="center">
<strong>Live editing of React Native in browser</strong>
<br><br>

## [Try it out](https://reactnative.info/playground/)

# react-native-live-code

**react-native-live-code** is an lightweighted React Native editor with live preview. it is ideal for quick UI component prototyping or educational purposes. The live editor supports TypeScript.

## Installation

```sh
npm install react-native-live-code
```

## Simple Setup

**react-native-live-code** offers two UI components: `RNLiveCodeRenderer` and `RNLiveCodeEditor` which can be positioned separately in any layouts. Additionally, `RNLiveCodeProvider` is required as a container for these components to communicate update of live editing.

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

## `RNLiveCodeEditor` Component

`RNLiveCodeEditor` is backed by [CodeMirror](https://codemirror.net/) for code highlighting and other lightweight IDE features.

| Prop               | Description                                                             | Default     |
| ------------------ | ----------------------------------------------------------------------- | ----------- |
| **`width`**        | Width of the editor view. Default value if not set.                     | 600px       |
| **`height`**       | Width of the editor view. Default value if not set.                     | 549px       |
| **`theme`**        | Be used to define a theme (e.g., @codemirror/theme-one-dark).           | okaidia     |
| **`onCodeChange`** | A callback when editing occurs.                                         | undefined   |

## `RNLiveCodeRenderer` Component

`RNLiveCodeRenderer` is where the evaluation (of live code) occurs. It also renders the evaluated component on the simulated viewport.

| Prop               | Description                                                             | Default     |
| ------------------ | ----------------------------------------------------------------------- | ----------- |
| **`width`**        | Width of the simulated viewport. Default value if not set.              | 285px       |
| **`height`**       | Width of the simulated viewport. Default value if not set.              | 549px       |

## `RNLiveCodeProvider`

`RNLiveCodeProvider` needs to be positioned as the container of both `RNLiveCodeEditor` and `RNLiveCodeRenderer` to facilitate the inter-component communication and to maintain the global states of react-native-live-code.

| Prop               | Description                                                             | Default     |
| ------------------ | ----------------------------------------------------------------------- | ----------- |
| **`defaultCode`**  | The initial code that is placed in editor and is rendered renderer.     | ''          |

## License

This project is licenced under the [MIT License](http://opensource.org/licenses/mit-license.html).

