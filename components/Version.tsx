import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function Version(props: LoadingProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={props.handleClose}>
          <Image
            style={styles.headerIcon}
            source={require('../public/assets/close.png')}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyer}>
        <Image
          source={require('../public/assets/xiaopeng.png')}
          style={styles.log}></Image>
        <Text style={styles.title}>AI 编程</Text>
        <Text style={styles.version}>版本号: {props.version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -200,
    marginTop: -200,
    width: 400,
    height: 400,
    zIndex: 999,
    backgroundColor: '#559aff',
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  header: {
    display: 'flex',
    // backgroundColor: 'white',
    width: 400,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderRightColor: 'red',
  },
  headerIcon: {
    width: 20,
    height: 20,
  },

  bodyer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  log: {
    width: 100,
    height: 100,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  version: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'semibold',
  },
});

type LoadingProps = {
  version: string;
  handleClose: () => void;
};
