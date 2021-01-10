import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { interval } from 'rxjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View } from '../../../components/Themed';
import Alarm, { AlarmStatus } from '../../../state/alarm';

const countdown$ = interval(1000); // 1 min

export default observer(() => {
  const [left, setLeft] = React.useState<string>('');
  const endTime = Alarm.endTime;

  React.useEffect(() => {
    const sub = countdown$.subscribe(() => {
      const timeLeft = endTime ? endTime.fromNow() : '';

      setLeft(timeLeft);
    });

    return () => sub.unsubscribe();
  }, []);

  if (Alarm.status === AlarmStatus.waiting) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Press sleep to start your alarm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {endTime && left ? (
        <View style={styles.container}>
          <Text style={styles.title}>Shh, waking {left}</Text>
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
