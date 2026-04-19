import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Shadow, Spacing } from '../../constants/spacing';

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
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    paddingVertical: Spacing.smd,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.button,
  },
  label: {
    ...Typography.button,
    color: Colors.textInverse,
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 1,
    backgroundColor: Colors.disabledBg,
    borderColor: Colors.borderLight,
    ...Shadow.card,
  },
});
