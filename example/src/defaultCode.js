export const defaultCode = `const REACT_ICON = 'https://reactnative.dev/img/header_logo.svg';

const SampleComponent = () => {
  const fadeAnim = useRef<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim.current, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim.current]);

  return (
    <Animated.View
      style={[styles.container, {
        opacity: fadeAnim.current,
      }]}
    >
      <ReactIcon />
      <Text>React Native anytime</Text>
    </Animated.View>
  );
};

const ReactIcon = ({size}: {size: number}) => {
  const rotationAnim = useRef<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotationAnim.current, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
        }),
        Animated.timing(rotationAnim.current, {
            toValue: 0,
            duration: 10000,
            useNativeDriver: true,
        }),
      ])
    ).start();
  }, [])
  return (
    <Animated.Image style={{
      width: size ?? 33,
      height: size ?? 30,
      transform: [{
        rotate: rotationAnim.current.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })
      }]
    }}
      source={{ uri: REACT_ICON }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    gap: 7,
  },
});

export default SampleComponent;
`;