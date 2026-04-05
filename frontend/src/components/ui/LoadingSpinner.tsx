import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/spacing';

interface Props { label?: string; fullScreen?: boolean; }

export default function LoadingSpinner({ label, fullScreen }: Props) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  fullScreen: { flex: 1 },
  label: { ...Typography.body, color: Colors.textSecondary, marginTop: 12 },
});
