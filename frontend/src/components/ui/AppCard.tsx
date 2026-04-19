import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'outlined';
}

export default function AppCard({ children, style, variant = 'default', ...props }: AppCardProps) {
  return (
    <View style={[styles.base, styles[variant], style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
  },
  default: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.card,
  },
  subtle: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
  },
});
