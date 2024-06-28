/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';

// const INJECTEDJAVASCRIPT = `
//   const meta = document.createElement('meta');
//   meta.setAttribute('content', 'initial-scale=1, maximum-scale=0.5, user-scalable=0');
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
  Linking,
  SafeAreaView,
} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import RNFS from 'react-native-fs';
import Loading from './components/Loading';
import Version from './components/Version';
import LinkServer from './utils/linkServer';
import MiniFPV from './utils/miniFPV';
function App(): React.JSX.Element {
  const wasLoaded = useRef(false);
  const [versionIsShow, setVersionIsShow] = useState(false);
  const linkServerRef = useRef<LinkServer | null>(null);
  useEffect(() => {
    const extentions = [
      {Class: MiniFPV, extention_id: 'minifpv', args: ['172.16.10.1', 9090]},
    ];
    if (!linkServerRef.current) {
      linkServerRef.current = new LinkServer(extentions);
    }
    // linkServerRef.current = new LinkServer(extentions);

    // if (Platform.OS === 'android') {
    //   const {Server, Udp} = NativeModules;
    //   const dataArray = [
    //     102, 20, 128, 126, 128, 128, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 153,
    //   ];

    //   setInterval(() => {
    //     Udp.sendUDPMessage(dataArray, '172.16.10.1', 9090);
    //   }, 50);
    //   // Server.createCalendarEvent((res: any) => console.log(res, 'res'));
    // } else {
    //   const extentions = [
    //     {Class: MiniFPV, extention_id: 'minifpv', args: ['172.16.10.1', 9090]},
    //   ];
    //   linkServerRef.current = new LinkServer(extentions);
    // }
  });
  //请求存储权限
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

  //下载文件
  const handleDownload = async (filename: string, base64Data: string) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.error('没有存储权限');
      return;
    }

    const base64Content = base64Data.split(';base64,').pop();
    if (base64Content) {
      switch (Platform.OS) {
        case 'android':
          //判断目录是否存在如果不存在则创建
          const dir = `${RNFS.ExternalStorageDirectoryPath}/a_kpaiedu/minifpv`;
          try {
            await RNFS.mkdir(dir);
          } catch (error) {
            console.error(error, 'error');
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

          break;
        case 'ios':
          const ios_path = `${RNFS.DocumentDirectoryPath}/${filename}`;
          try {
            await RNFS.writeFile(ios_path, base64Content, 'base64');
            console.log(
              `文件已保存到：${RNFS.DocumentDirectoryPath}/${filename}`,
            );
            Alert.alert(
              `文件已保存到：${RNFS.DocumentDirectoryPath}/${filename}`,
            );
          } catch (error) {
            console.error('保存文件失败，请检查是否开启文件访问权限');
          }
          break;
        default:
          break;
      }
    } else {
      console.error('无效的Base64数据');
    }
  };

  //webview消息处理
  const onMessage = (event: WebViewMessageEvent) => {
    const {data} = event.nativeEvent;
    const message = JSON.parse(data);
    switch (message.type) {
      case 'DOWNLOAD':
        const {filename, data: base64Data} = message;
        handleDownload(filename, base64Data);
        break;
      case 'VERSION':
        console.log('version', data);
        showVersion();
        break;
      case 'UAV_CTROLLER':
        console.log(message.data, 'message');
        linkServerRef.current?.onMessage(JSON.parse(message.data));
        break;
      default:
        break;
    }
  };

  const loadEnd = () => {
    if (wasLoaded.current) {
      setTimeout(() => {
        console.log('loading页面隐藏');
        wasLoaded.current = false;
      }, 1000);
    }
  };

  const handleWebviewLoaded = useCallback(() => {
    console.log('页面开始加载', wasLoaded.current);
    if (!wasLoaded.current) {
      console.log('loading页面显示');
      wasLoaded.current = true;
    }
  }, []);

  const showVersion = () => {
    setVersionIsShow(true);
  };
  const closeVersion = () => {
    setVersionIsShow(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {wasLoaded.current && (
        <Loading
          text="精彩即将开启"
          uri={require('./public/assets/logo_img.png')}
        />
      )}
      {versionIsShow && (
        <Version version="beta0.0.1" handleClose={closeVersion} />
      )}

      <WebView
        source={{
          uri: `${
            Platform.OS === 'android' ? 'file:///android_asset/' : ''
          }Web.bundle/index.html`,
        }}
        platform={Platform.OS === 'ios' ? 'ios' : 'android'}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        scalesPageToFit={false}
        injectedJavaScript={INJECTEDJAVASCRIPT}
        onMessage={onMessage}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        // onLoadStart={loadStart}
        onLoad={handleWebviewLoaded}
        onLoadEnd={loadEnd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#159acd',
    backgroundColor: '#f9f9f9',

    display: 'flex',
    position: 'relative',
    flex: 1,
  },
  // webview: {
  //   flex: 1,
  //   width: 500,
  //   height: 500,
  // },
});

export default App;
