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
  Alert,
  PermissionsAndroid,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import RNFS from 'react-native-fs'; // 假设您已经安装了react-native-fs
function App(): React.JSX.Element {
  useEffect(() => {
    const {Server} = NativeModules;
    Server.createCalendarEvent((res: any) => console.log(res));
  });

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '存储权限',
            message: '应用需要访问您的存储来保存文件',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleDownload = async (filename: string, base64Data: string) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.error('没有存储权限');
      return;
    }

    const base64Content = base64Data.split(';base64,').pop();
    if (base64Content) {
      //判断目录是否存在如果不存在则创建
      const dir = `${RNFS.ExternalStorageDirectoryPath}/a_kpaiedu/minifpv`;
      try {
        await RNFS.mkdir(dir);
      } catch (error) {
        console.error('创建目录失败，请检查是否开启文件访问权限');
      }
      const path = `${RNFS.ExternalStorageDirectoryPath}/a_kpaiedu/minifpv/${filename}`;
      try {
        await RNFS.writeFile(path, base64Content, 'base64');
        console.log(`文件已保存到：/a_kpaiedu/minifpv/${filename}`);
        Alert.alert(`文件已保存到：/a_kpaiedu/minifpv/${filename}`);
      } catch (error) {
        console.error('保存文件失败，请检查是否开启文件访问权限');
      }
    } else {
      console.error('无效的Base64数据');
    }
  };

  const onMessage = (event: WebViewMessageEvent) => {
    const {data} = event.nativeEvent;
    const message = JSON.parse(data);
    if (message.type === 'DOWNLOAD') {
      const {filename, data: base64Data} = message;
      handleDownload(filename, base64Data);
    }
  };

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
        onMessage={onMessage}
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
