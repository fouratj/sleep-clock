import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Button from '../components/Button';

export default function TabOneScreen() {
  const [sound, setSound] = React.useState<any>(undefined);
  const [timer, setTimer] = React.useState(5000);
  const [timerInterval, setTimerInterval] = React.useState<any>(undefined);
  const [cancel, setCancel] = React.useState(false);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/audio/alarm.wav'),
    );
    setSound(sound);

    await sound.playAsync();
  }

  function setAlarm() {
    const timerInterval = setTimeout(() => playSound(), timer);

    setTimerInterval(timerInterval);
  }

  function stopSound() {
    setSound(undefined);
  }

  React.useEffect(() => {
    if (cancel) {
      setTimerInterval(undefined);
    }
  }, [cancel]);

  React.useEffect(() => () => sound?.unloadAsync(), [sound]);

  return (
    <View style={styles.container}>
      {sound ? (
        <Button btnText="Stop" onClick={stopSound} />
      ) : (
        <Button btnText="Sleep" onClick={setAlarm} />
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
