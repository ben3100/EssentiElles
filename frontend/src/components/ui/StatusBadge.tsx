import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius } from '../../constants/spacing';

type BadgeType = 'active' | 'paused' | 'cancelled' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'pending' | 'paid' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'new' | 'promo' | 'bestseller';

interface Props {
  status: BadgeType | string;
  label?: string;
  small?: boolean;
}

const badgeConfig: Record<string, { bg: string; color: string; emoji: string }> = {
  active:     { bg: Colors.statusActiveBg,   color: Colors.statusActive,    emoji: '✓' },
  paused:     { bg: Colors.statusPausedBg,   color: Colors.statusPaused,    emoji: '⏸' },
  cancelled:  { bg: Colors.statusCancelledBg, color: Colors.statusCancelled, emoji: '✕' },
  confirmed:  { bg: Colors.infoBg,           color: Colors.info,            emoji: '✓' },
  preparing:  { bg: Colors.statusPausedBg,   color: Colors.statusPaused,    emoji: '📦' },
  shipped:    { bg: Colors.infoBg,           color: Colors.info,            emoji: '🚚' },
  delivered:  { bg: Colors.statusActiveBg,   color: Colors.statusActive,    emoji: '✓' },
  pending:    { bg: Colors.statusPausedBg,   color: Colors.statusPaused,    emoji: '⏳' },
  paid:       { bg: Colors.statusActiveBg,   color: Colors.statusActive,    emoji: '✓' },
  open:       { bg: Colors.statusCancelledBg, color: Colors.statusCancelled, emoji: '!' },
  in_progress:{ bg: Colors.statusPausedBg,   color: Colors.statusPaused,    emoji: '🔄' },
  resolved:   { bg: Colors.statusActiveBg,   color: Colors.statusActive,    emoji: '✓' },
  closed:     { bg: Colors.borderLight,      color: Colors.textTertiary,    emoji: '✓' },
  new:        { bg: Colors.infoBg,           color: Colors.info,            emoji: '★' },
  promo:      { bg: Colors.warningBg,        color: Colors.warning,         emoji: '%' },
  bestseller: { bg: Colors.primaryPale,      color: Colors.primaryDark,     emoji: '♥' },
};

export default function StatusBadge({ status, label, small }: Props) {
  const config = badgeConfig[status] || { bg: Colors.borderLight, color: Colors.textTertiary, emoji: '' };
  const displayLabel = label || status.replace('_', ' ');

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, small && styles.small]}>
      <Text style={[styles.text, { color: config.color }, small && styles.smallText]}>
        {displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  small: { paddingHorizontal: 8, paddingVertical: 3 },
  text: { ...Typography.caption, fontFamily: 'Poppins_600SemiBold' },
  smallText: { fontSize: 10 },
});
