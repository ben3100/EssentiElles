import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, Spacing, Shadow, BorderRadius } from '../../constants/spacing';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = 'cube-outline', title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={Colors.primaryLight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.desc}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.btn} onPress={onAction}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, minHeight: 200 },
  iconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primaryPale,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: { ...Typography.h4, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm },
  desc: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg },
  btn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.pill,
    paddingVertical: 12, paddingHorizontal: 24,
    ...Shadow.button,
  },
  btnText: { ...Typography.button, color: Colors.textInverse },
});
