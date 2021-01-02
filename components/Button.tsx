import React from 'react';
import { Button as RNButton } from 'react-native-elements';
import { Text, TouchableOpacity, View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

type Props = {
  btnText: string;
  onClick: () => any;
  icon?: any;
};

export default function Button({ btnText, onClick, icon }: Props) {
  return (
    <RNButton
      buttonStyle={{ height: 60, width: 200 }}
      onPress={onClick}
      title={btnText}
      raised
      icon={icon}
    />
  );
}
