import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Spacing, Shadow } from '../../constants/spacing';
import { Order } from '../../models/types';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  order: Order;
  onPress: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function OrderCard({ order, onPress }: Props) {
  return (
    <TouchableOpacity
      testID={`order-card-${order.id}`}
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="cube-outline" size={22} color={Colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.orderNum}>{order.orderNumber}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <StatusBadge status={order.status} small />
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.items} numberOfLines={1}>
          {order.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}
        </Text>
        <Text style={styles.total}>{order.total.toFixed(2)} €</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44, height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryPale,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  info: { flex: 1 },
  orderNum: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  date: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular' },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  items: { flex: 1, fontSize: 12, color: Colors.textSecondary, fontFamily: 'Poppins_400Regular', marginRight: 8 },
  total: { fontSize: 14, color: Colors.primary, fontFamily: 'Poppins_700Bold' },
});
