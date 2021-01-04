import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { interval } from 'rxjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View } from '../../components/Themed';
import Button from '../../components/Button';
import Alarm, { AlarmStatus } from '../../state/alarm';

const countdown$ = interval(1000); // 1 min

export default observer(() => {
  const [left, setLeft] = React.useState<string | undefined>('');
  const timer = React.useRef<number>();
  const soundRef = React.useRef<Audio.Sound>();
  const endTime = Alarm.endTime;

  React.useEffect(() => {
    Audio.Sound.createAsync(require('../assets/audio/alarm.wav')).then(
      ({ sound }) => {
        soundRef.current = sound;
      },
    );

    return () => {
      soundRef.current?.unloadAsync();
      window.clearTimeout(timer.current);
    };
  }, []);

  const setAlarm = React.useCallback(() => {
    const endTime = dayjs().add(Alarm.duration, 'ms');
    Alarm.setEndTime(endTime);

    setLeft(endTime.fromNow());
    Alarm.setStatus(AlarmStatus.ticking);

    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      Alarm.setStatus(AlarmStatus.ringing);
      soundRef.current?.playAsync();
    }, Alarm.duration);
  }, []);

  const stopAlarm = React.useCallback(() => {
    Alarm.setEndTime(null);
    setLeft(undefined);
    window.clearTimeout(timer.current);
    dismissAlarm();
  }, []);

  const dismissAlarm = React.useCallback(() => {
    Alarm.setEndTime(null);
    setLeft(undefined);
    stopSound();
  }, []);

  async function stopSound() {
    await soundRef.current?.stopAsync();
    Alarm.setStatus(AlarmStatus.waiting);
  }

  const button = React.useMemo(() => {
    switch (Alarm.status) {
      case AlarmStatus.waiting:
        return (
          <Button
            btnText="Sleep"
            onClick={setAlarm}
            icon={<MaterialCommunityIcons name="sleep" size={30} />}
          />
        );
      case AlarmStatus.ticking:
        return (
          <Button
            btnText="Stop"
            onClick={stopAlarm}
            icon={
              <MaterialCommunityIcons name="stop-circle-outline" size={30} />
            }
          />
        );
      case AlarmStatus.ringing:
        return (
          <Button
            btnText="Dismiss"
            onClick={dismissAlarm}
            icon={<MaterialCommunityIcons name="close" size={30} />}
          />
        );
    }
  }, [Alarm.status]);

  React.useEffect(() => {
    const sub = countdown$.subscribe(() => {
      const timeLeft = endTime ? endTime.fromNow() : '';
      console.log({ timeLeft });
      setLeft(timeLeft);
    });

    return () => sub.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {endTime && left ? (
        <View style={styles.container}>
          <Text style={styles.title}>Shh, waking {left}</Text>
        </View>
      ) : null}

      <View style={styles.separator}></View>

      <View style={styles.container}>{button}</View>
    </View>
  );
});

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
