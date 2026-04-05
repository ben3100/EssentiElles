import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Shadow } from '../../constants/spacing';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function PrimaryButton({ label, onPress, loading, disabled, style, textStyle, testID }: Props) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.btn, (disabled || loading) && styles.disabled, style]}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textInverse} size="small" />
      ) : (
        <Text style={[styles.label, textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  label: {
    ...Typography.button,
    color: Colors.textInverse,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
