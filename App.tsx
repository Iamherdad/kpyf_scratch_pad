/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

// const INJECTEDJAVASCRIPT = `
//   const meta = document.createElement('meta');
//   meta.setAttribute('content', 'initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
//   meta.setAttribute('name', 'viewport');
//   document.getElementsByTagName('head')[0].appendChild(meta);
// `;
const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta'); 
  meta.setAttribute('content', 'initial-scale=1, maximum-scale=0.5, user-scalable=0'); 
  meta.setAttribute('name', 'viewport'); 
  document.getElementsByTagName('head')[0].appendChild(meta); 
`;

import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Button,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';

function App(): React.JSX.Element {
  useEffect(() => {
    const {Server} = NativeModules;
    Server.createCalendarEvent((res: any) => console.log(res));
  });

  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: `${
            Platform.OS === 'android' ? 'file:///android_asset/' : ''
          }Web.bundle/index.html`,
          originWhitelist: ['*'],
        }}
        javaScriptEnabled={true}
        scalesPageToFit={false}
        injectedJavaScript={INJECTEDJAVASCRIPT}
      />
      {/* <WebView
        source={{
          uri: `http://8.137.17.205/`,
          originWhitelist: ['*'],
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#159acd',
    display: 'flex',
  },
  webview: {
    flex: 1,
    width: 500,
    height: 500,
  },
});

export default App;
