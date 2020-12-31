import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  btnText: string;
  onClick: () => any;
};

export default function Button({ btnText, onClick }: Props) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{ backgroundColor: 'blue', padding: 20 }}
    >
      <Text style={{ fontSize: 20, color: '#fff' }}>{btnText}</Text>
    </TouchableOpacity>
  );
}
