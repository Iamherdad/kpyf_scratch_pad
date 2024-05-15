/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

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
  const handleStartClick = async () => {
    const {Server} = NativeModules;
    Server.createCalendarEvent((res: any) => console.log(res));
  };

  useEffect(() => {
    const {Server} = NativeModules;
    Server.createCalendarEvent((res: any) => console.log(res));
  });

  return (
    <View style={styles.container}>
      {/* <Button title="开启linserver" onPress={() => handleStartClick()}></Button>
      <Text>kpyf_scratch_pad</Text> */}
      <WebView
        source={{
          uri: `${
            Platform.OS === 'android' ? 'file:///android_asset/' : ''
          }Web.bundle/index.html`,
          originWhitelist: ['*'],
        }}
      />
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
