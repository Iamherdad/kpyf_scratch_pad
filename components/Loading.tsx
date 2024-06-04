import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, Text, Animated} from 'react-native';

function Loading(props: LoadingProps): React.JSX.Element {
  const translateYAnim = useRef(new Animated.Value(0)).current; // 初始位置
  useEffect(() => {
    // 动画序列
    const animationSequence = Animated.sequence([
      // 0% -> 40%
      Animated.timing(translateYAnim, {
        toValue: 16, // 下移16px
        duration: 400, // 总动画时长的40%
        useNativeDriver: true,
      }),
      // 40% -> 50%
      Animated.timing(translateYAnim, {
        toValue: 20, // 继续下移至20px
        duration: 100, // 10%的时长
        useNativeDriver: true,
      }),
      // 50% -> 60%
      Animated.timing(translateYAnim, {
        toValue: 16, // 回移至16px
        duration: 100, // 10%的时长
        useNativeDriver: true,
      }),
      // 60% -> 100%
      Animated.timing(translateYAnim, {
        toValue: 0, // 回到原位
        duration: 400, // 剩余40%的时长
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(animationSequence).start(); // 循环播放
  }, [translateYAnim]);
  return (
    <View style={styles.container}>
      <Animated.Image
        style={[
          styles.logoCloud,
          {
            transform: [{translateY: translateYAnim}],
          },
        ]}
        source={props.uri}
      />
      <Text style={styles.splash}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#559AFF',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCloud: {
    width: 120,
    height: 95,
  },
  splash: {
    color: 'white',
    fontSize: 28,
  },
});

type LoadingProps = {
  text: string;
  uri: any;
};

export default Loading;
