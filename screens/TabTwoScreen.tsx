import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Avatar, Overlay } from 'react-native-elements';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Picker from '../components/Picker';
import Alarm from '../state/alarm';

const list = [
  {
    name: 'Sleep Time',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Time you would like to sleep for',
    onPress: (toggle: () => void) => toggle(),
  },
];

export default function TabTwoScreen() {
  const [visible, setVisible] = React.useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const onChange = (a) => {
    Alarm.setDuration(a);
  };

  return (
    <View>
      {list.map((l, i) => (
        <ListItem key={l.name} bottomDivider onPress={toggleOverlay}>
          <Avatar source={{ uri: l.avatar_url }} />
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={styles.container}>
          <Picker onSelected={onChange} />
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 250,
    height: 250,
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
