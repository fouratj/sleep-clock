import React from 'react';
import { Button as RNButton } from 'react-native-elements';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  btnText: string;
  onClick: () => any;
  icon?: any;
};

export default function Button({ btnText, onClick, icon }: Props) {
  return <RNButton title={btnText} onPress={onClick} raised icon={icon} />;
}
