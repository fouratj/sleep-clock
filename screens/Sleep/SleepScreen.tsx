import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { observer } from 'mobx-react';
import { Button as RNButton } from 'react-native-elements';

import { Text, View } from '../../components/Themed';
import Top from './components/Top';
import Bottom from './components/Bottom';

export default function SleepScreen() {
  const [loading, setLoading] = React.useState(true);
  const soundRef = React.useRef<Audio.Sound>();

  React.useEffect(() => {
    setLoading(true);

    Audio.Sound.createAsync(require('../../assets/audio/alarm.wav')).then(
      ({ sound }) => {
        soundRef.current = sound;
        setLoading(false);
      },
    );

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const stopSound = React.useCallback(async () => {
    await soundRef.current?.stopAsync();
  }, []);

  const playSound = React.useCallback(async () => {
    await soundRef.current?.playAsync();
  }, []);

  if (loading) {
    return <RNButton title="" loading />;
  }

  return (
    <View style={styles.container}>
      <Top />

      <View style={styles.separator}></View>

      <Bottom stopSound={stopSound} playSound={playSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: 'white',
  },
});
