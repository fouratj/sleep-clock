import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import dayjs from 'dayjs';
import { observer } from 'mobx-react';
import { interval } from 'rxjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Text, View } from '../../../components/Themed';
import Button from '../../../components/Button';
import Alarm, { AlarmStatus } from '../../../state/alarm';

type Props = {
  stopSound: () => void;
  playSound: () => void;
};

export default observer(({ stopSound, playSound }: Props) => {
  const timer = React.useRef<number>();

  React.useEffect(() => {
    return () => window.clearTimeout(timer.current);
  }, []);

  const setAlarm = React.useCallback(() => {
    const endTime = dayjs().add(Alarm.duration, 'ms');
    Alarm.setEndTime(endTime);
    Alarm.setStatus(AlarmStatus.ticking);

    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      Alarm.setStatus(AlarmStatus.ringing);
      playSound();
    }, Alarm.duration);
  }, [playSound, timer]);

  const stopAlarm = React.useCallback(() => {
    Alarm.setStatus(AlarmStatus.waiting);
    Alarm.setEndTime(null);
    window.clearTimeout(timer.current);
    dismissAlarm();
  }, []);

  const dismissAlarm = React.useCallback(() => {
    Alarm.setStatus(AlarmStatus.waiting);
    Alarm.setEndTime(null);
    // setLeft(undefined);
    stopSound();
  }, []);

  const button = React.useMemo(() => {
    switch (Alarm.status) {
      case AlarmStatus.waiting:
        return (
          <Button
            btnText="Sleep"
            onClick={setAlarm}
            icon={<MaterialCommunityIcons name="sleep" size={30} />}
            key="sleep"
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
            key="stop"
          />
        );
      case AlarmStatus.ringing:
        return (
          <Button
            btnText="Dismiss"
            onClick={dismissAlarm}
            icon={<MaterialCommunityIcons name="close" size={30} />}
            key="dismiss"
          />
        );
    }
  }, [Alarm.status]);

  return <View style={styles.container}>{button}</View>;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'red',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
