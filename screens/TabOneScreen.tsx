import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';

import { Text, View } from '../components/Themed';
import Button from '../components/Button';
import { of, interval, concat, Subject, Subscription } from 'rxjs';
import {
  takeWhile,
  takeUntil,
  scan,
  startWith,
  share,
  filter,
  tap,
  repeatWhen,
  finalize,
} from 'rxjs/operators';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Alarm from '../state/alarm';

const DEFAULT_TIME = 1000 * 60 * 2; // * 60 * 7.5; // 8 hours

const countdown$ = interval(60000); // 1 min

enum Current {
  waiting = 'waiting',
  ticking = 'ticking',
  ringing = 'ringing',
}

export default observer(function TabOneScreen() {
  const [current, setCurrent] = React.useState<Current>(Current.waiting);
  const [left, setLeft] = React.useState<string>('');
  const timer = React.useRef<number>();
  const soundRef = React.useRef<any>();
  const endTime = Alarm.endTime;

  React.useEffect(() => {
    Audio.Sound.createAsync(require('../assets/audio/alarm.wav'), {
      progressUpdateIntervalMillis: 500,
      positionMillis: 0,
      shouldPlay: false,
      rate: 1.0,
      shouldCorrectPitch: false,
      volume: 1.0,
      isMuted: false,
      isLooping: false,
    }).then(({ sound, status }) => {
      soundRef.current = sound;
    });

    return () => {
      soundRef.current?.unloadAsync();
      window.clearTimeout(timer.current);
    };
  }, []);

  const setAlarm = React.useCallback(() => {
    const endTime = dayjs().add(Alarm.duration, 'ms');
    Alarm.setEndTime(endTime);

    setLeft(endTime.fromNow());

    setCurrent(Current.ticking);

    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      setCurrent(Current.ringing);
      soundRef.current.playAsync();
    }, Alarm.duration);
  }, []);

  const stopAlarm = React.useCallback(() => {
    Alarm.setEndTime(null);
    window.clearTimeout(timer.current);
    dismissAlarm();
  }, []);

  const dismissAlarm = React.useCallback(() => {
    Alarm.setEndTime(null);
    stopSound();
  }, []);

  async function stopSound() {
    await soundRef.current.stopAsync();
    setCurrent(Current.waiting);
  }

  const button = React.useMemo(() => {
    switch (current) {
      case Current.waiting:
        return (
          <Button
            btnText="Sleep"
            onClick={() => setAlarm()}
            icon={<MaterialCommunityIcons name="sleep" size={30} />}
          />
        );
      case Current.ticking:
        return (
          <Button
            btnText="Stop"
            onClick={() => stopAlarm()}
            icon={
              <MaterialCommunityIcons name="stop-circle-outline" size={30} />
            }
          />
        );
      case Current.ringing:
        return (
          <Button
            btnText="Dismiss"
            onClick={() => dismissAlarm()}
            icon={<MaterialCommunityIcons name="close" size={30} />}
          />
        );
    }
  }, [current]);

  React.useEffect(() => {
    const sub = countdown$.subscribe(() => {
      const timeLeft = endTime ? endTime.fromNow() : '';

      setLeft(timeLeft);
    });

    return () => sub.unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {left ? <Text>Wake {left}</Text> : null}

      {button}
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
