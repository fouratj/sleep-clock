import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { interval } from 'rxjs';

import { Text, View } from '../../../components/Themed';
import Alarm, { AlarmStatus } from '../../../state/alarm';
import { padDigit } from '../../../util/padding'

const countdown$ = interval(1000); // 1 min

export default observer(() => {
  const [num, setNum] = React.useState(0);
  const endTime = Alarm.endTime;

  React.useEffect(() => {
    const sub = countdown$.subscribe(setNum);

    return () => sub.unsubscribe();
  }, []);

  if (Alarm.status === AlarmStatus.waiting) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Press sleep to start your alarm</Text>
      </View>
    );
  }

  let parts;

  if (endTime) {
    const ms = dayjs().diff(endTime, 'ms');

    const hours = Math.abs(ms / (1000 * 60 * 60) % 60);
    const minutes = Math.abs(ms / (1000 * 60) % 60);
    const seconds = Math.abs(ms / 1000 % 60);

    parts = {
      hours : Math.floor(hours),
      minutes : Math.floor(minutes),
      seconds : Math.floor(seconds),
    };
  }

  return (
    <View style={styles.container}>
      {endTime ? (
        <View style={styles.container}>
          <Text style={styles.title}>Shh, waking {endTime.fromNow()}</Text>
          {parts ? (
            <Text style={styles.title}>
              {padDigit(parts.hours)}:{padDigit(parts.minutes)}:{padDigit(parts.seconds)}
            </Text>
          ) : null}
        </View>
      ) : null}
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
});
