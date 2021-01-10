import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { interval } from 'rxjs';

import { Text, View } from '../../../components/Themed';
import Alarm, { AlarmStatus } from '../../../state/alarm';

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
    const difference = dayjs().diff(endTime, 'ms');

    parts = {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    console.log({ parts });
  }

  return (
    <View style={styles.container}>
      {endTime ? (
        <View style={styles.container}>
          <Text style={styles.title}>Shh, waking {endTime.fromNow()}</Text>
          {parts ? (
            <Text style={styles.title}>
              {parts.hours}:{parts.minutes}:{parts.seconds}
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
