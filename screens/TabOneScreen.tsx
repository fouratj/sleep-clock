import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
// import { observer } from 'mobx-react';
import dayjs from 'dayjs';

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

// let soundObj;
// async function playSound() {
//   if (soundObj) {
//     await soundObj.playAsync();
//   }

//   Audio.Sound.createAsync(require('../assets/audio/alarm.wav')).then(
//     ({ sound }) => {
//       console.log(sound);
//       soundObj = sound;

//       soundObj.playAsync();
//     },
//   );
// }

// const DEFAULT_TIME = 5; //1000 * 60 * 60 * 8; // 8 hours

// const countdown$ = interval(1000)
//   .pipe(
//     startWith(DEFAULT_TIME),
//     scan((time) => time - 1),
//     takeWhile((time) => time > 0),
//     finalize(() => {
//       playSound();
//     }),
//   )
//   .pipe(share());

// const actions$ = new Subject();

// const snooze$ = actions$.pipe(
//   filter((action) => action === 'snooze'),
//   tap(() => {
//     // soundObj = undefined;
//     soundObj?.unloadAsync();
//   }),
// );
// const dismiss$ = actions$.pipe(filter((action) => action === 'dismiss'));

// const alarm$ = concat(countdown$, of('Wake up! 🎉')).pipe(
//   repeatWhen(() => snooze$),
// );

// const observable$ = concat(
//   alarm$.pipe(takeUntil(dismiss$)),
//   of('Have a nice day! 🤗'),
// );

enum Current {
  waiting = 'waiting',
  ticking = 'ticking',
  ringing = 'ringing',
}

export default function TabOneScreen() {
  const [current, setCurrent] = React.useState<Current>(Current.waiting);
  let timer = React.useRef<number>();
  const soundRef = React.useRef<any>();

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

  function setAlarm() {
    setCurrent(Current.ticking);
    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      setCurrent(Current.ringing);
      console.log('playing sound');
      soundRef.current.playAsync();
    }, 3000);
  }

  function stopAlarm() {
    window.clearTimeout(timer.current);
    dismissAlarm();
  }

  function dismissAlarm() {
    stopSound();
  }

  async function stopSound() {
    await soundRef.current.stopAsync();
    setCurrent(Current.waiting);
  }

  const button = React.useMemo(() => {
    switch (current) {
      case Current.waiting:
        return <Button btnText="Sleep" onClick={() => setAlarm()} />;
      case Current.ticking:
        return <Button btnText="Stop" onClick={() => stopAlarm()} />;
      case Current.ringing:
        return <Button btnText="Dismiss" onClick={() => dismissAlarm()} />;
    }
  }, [current]);

  return <View style={styles.container}>{button}</View>;
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
