import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Spacing } from '../../constants/spacing';

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
      <Text style={[styles.label, outlined ? styles.labelOutlined : styles.labelSoft, disabled && styles.labelDisabled, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.smd,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderMedium,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.surface,
  },
  soft: {
    backgroundColor: Colors.primaryPale,
    borderColor: Colors.primaryLight,
  },
  label: {
    ...Typography.button,
    letterSpacing: 0.2,
  },
  labelOutlined: { color: Colors.primaryDark },
  labelSoft: { color: Colors.primaryDark },
  disabled: { opacity: 1, backgroundColor: Colors.disabledBg, borderColor: Colors.borderLight },
  labelDisabled: { color: Colors.disabledText },
});
