import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Spacing, Shadow } from '../../constants/spacing';
import { Subscription } from '../../models/types';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  subscription: Subscription;
  onPress?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
}

const freqLabels: Record<string, string> = {
  weekly: 'Hebdomadaire',
  biweekly: 'Toutes les 2 semaines',
  monthly: 'Mensuel',
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SubscriptionCard({ subscription, onPress, onPause, onResume, onCancel }: Props) {
  const product = subscription.product;
  const isActive = subscription.status === 'active';
  const isPaused = subscription.status === 'paused';

  return (
    <TouchableOpacity
      testID={`subscription-card-${subscription.id}`}
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.header}>
        {product?.images?.[0] ? (
          <Image source={{ uri: product.images[0] }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.imgPlaceholder]}>
            <Ionicons name="cube-outline" size={24} color={Colors.primaryLight} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.brand}>{product?.brand || '—'}</Text>
          <Text style={styles.name} numberOfLines={2}>{product?.name || 'Produit'}</Text>
          <Text style={styles.freq}>{freqLabels[subscription.frequency] || subscription.frequency}</Text>
        </View>
        <StatusBadge status={subscription.status} small />
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textTertiary} />
          <Text style={styles.detailLabel}> Prochain envoi</Text>
          <Text style={styles.detailValue}>{formatDate(subscription.nextDeliveryDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cube-outline" size={14} color={Colors.textTertiary} />
          <Text style={styles.detailLabel}> Quantité</Text>
          <Text style={styles.detailValue}>×{subscription.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="card-outline" size={14} color={Colors.textTertiary} />
          <Text style={styles.detailLabel}> Total</Text>
          <Text style={[styles.detailValue, { color: Colors.primary, fontFamily: 'Poppins_600SemiBold' }]}>
            {subscription.totalPrice.toFixed(2)} €
          </Text>
        </View>
      </View>

      {(isActive || isPaused) && (
        <View style={styles.actions}>
          {isActive && onPause && (
            <TouchableOpacity
              testID={`subscription-pause-btn-${subscription.id}`}
              style={styles.actionBtn}
              onPress={onPause}
            >
              <Ionicons name="pause-circle-outline" size={15} color={Colors.warning} />
              <Text style={[styles.actionText, { color: Colors.warning }]}>Pause</Text>
            </TouchableOpacity>
          )}
          {isPaused && onResume && (
            <TouchableOpacity
              testID={`subscription-resume-btn-${subscription.id}`}
              style={styles.actionBtn}
              onPress={onResume}
            >
              <Ionicons name="play-circle-outline" size={15} color={Colors.success} />
              <Text style={[styles.actionText, { color: Colors.success }]}>Reprendre</Text>
            </TouchableOpacity>
          )}
          {onCancel && (
            <TouchableOpacity
              testID={`subscription-cancel-btn-${subscription.id}`}
              style={styles.actionBtn}
              onPress={onCancel}
            >
              <Ionicons name="close-circle-outline" size={15} color={Colors.error} />
              <Text style={[styles.actionText, { color: Colors.error }]}>Annuler</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  img: { width: 60, height: 60, borderRadius: BorderRadius.md, marginRight: 12 },
  imgPlaceholder: { backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginRight: 8 },
  brand: { fontSize: 10, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium', textTransform: 'uppercase' },
  name: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginTop: 2 },
  freq: { fontSize: 11, color: Colors.primary, fontFamily: 'Poppins_500Medium', marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  details: { flexDirection: 'row', justifyContent: 'space-between' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailLabel: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular' },
  detailValue: { fontSize: 12, color: Colors.textPrimary, fontFamily: 'Poppins_500Medium', marginLeft: 2 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8 },
  actionText: { fontSize: 12, fontFamily: 'Poppins_500Medium' },
});
