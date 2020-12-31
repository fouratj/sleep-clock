import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Button from '../components/Button';

export default function TabOneScreen() {
  const [sound, setSound] = React.useState<any>(undefined);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/alarm.wav'),
    );
    setSound(sound);

    await sound.playAsync();
  }

  function stopSound() {
    setSound(undefined);
  }

  React.useEffect(() => () => sound?.unloadAsync(), [sound]);

  return (
    <View style={styles.container}>
      {sound ? (
        <Button btnText="Stop" onClick={stopSound} />
      ) : (
        <Button btnText="Sleep" onClick={playSound} />
      )}
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
  },
});
