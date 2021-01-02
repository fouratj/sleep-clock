import React, { useState } from 'react';
import { Picker as RNPicker, StyleSheet } from 'react-native';

import { Text, View } from './Themed';

import { Picker as RNPicker1 } from '@react-native-picker/picker';

const ONE_HOUR = 1000 * 60 * 60;

const options = [
  { label: '4 hours', value: ONE_HOUR * 4 },
  { label: '5 hours', value: ONE_HOUR * 5 },
  { label: '6 hours', value: ONE_HOUR * 6 },
  { label: '7 hours', value: ONE_HOUR * 7 },
  { label: '8 hours', value: ONE_HOUR * 8 },
];

type Props = {
  defaultValue?: string;
  onSelected: (op: number) => void;
};

const Picker = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState(
    props.defaultValue || options[0].label, // todo fix default value
  );

  const handleChange = (a) => {
    setSelectedValue(a);
    props.onSelected(a);
  };

  return (
    <View style={styles.container}>
      <Text>Choose duration of sleep</Text>
      <RNPicker1
        selectedValue={selectedValue}
        style={styles.pickItem}
        onValueChange={(itemValue) => handleChange(itemValue)}
      >
        {options.map((option) => (
          <RNPicker1.Item
            key={option.label}
            label={option.label}
            value={option.value}
          />
        ))}
      </RNPicker1>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickItem: {
    height: 50,
    width: 150,
    color: 'white',
  },
});

export default Picker;
