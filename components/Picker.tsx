import React, { useState } from 'react';
import { View, Picker as RNPicker, StyleSheet } from 'react-native';

const ONE_HOUR = 1000 * 60 * 60;

const options = [
  { label: '4 hours', value: ONE_HOUR * 4 },
  { label: '5 hours', value: ONE_HOUR * 5 },
  { label: '6 hours', value: ONE_HOUR * 6 },
  { label: '7 hours', value: ONE_HOUR * 7 },
  { label: '8 hours', value: ONE_HOUR * 8 },
];

type Props = {
  onSelected: (op: number) => void;
};

const Picker = (props: Props) => {
  const [selectedValue, setSelectedValue] = useState('java');

  const handleChange = (a) => {
    setSelectedValue(a);
    props.onSelected(a);
  };

  return (
    <View style={styles.container}>
      <RNPicker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue, itemIndex) => handleChange(itemValue)}
      >
        {options.map((option) => (
          <RNPicker.Item
            key={option.label}
            label={option.label}
            value={option.value}
          />
        ))}
      </RNPicker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Picker;
