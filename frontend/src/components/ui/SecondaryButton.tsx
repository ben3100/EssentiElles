import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius } from '../../constants/spacing';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  outlined?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function SecondaryButton({ label, onPress, disabled, outlined = true, style, textStyle, testID }: Props) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, outlined ? styles.outlined : styles.soft, disabled && styles.disabled, style]}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, outlined ? styles.labelOutlined : styles.labelSoft, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: BorderRadius.pill,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.transparent,
  },
  soft: {
    backgroundColor: Colors.secondary,
  },
  label: {
    ...Typography.button,
    letterSpacing: 0.3,
  },
  labelOutlined: { color: Colors.primary },
  labelSoft: { color: Colors.primaryDark },
  disabled: { opacity: 0.5 },
});
