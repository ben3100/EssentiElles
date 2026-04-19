import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/spacing';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export default function AppBadge({ label, variant = 'neutral', style }: AppBadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.smd,
    paddingVertical: Spacing.xs,
  },
  label: {
    ...Typography.caption,
    fontFamily: 'Poppins_500Medium',
  },
});

const variantStyles = StyleSheet.create({
  neutral: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.borderLight,
  },
  success: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warning,
  },
  error: {
    backgroundColor: Colors.errorBg,
    borderColor: Colors.error,
  },
  info: {
    backgroundColor: Colors.infoBg,
    borderColor: Colors.info,
  },
});

const labelStyles = StyleSheet.create({
  neutral: { color: Colors.textSecondary },
  success: { color: Colors.success },
  warning: { color: Colors.warning },
  error: { color: Colors.error },
  info: { color: Colors.info },
});
