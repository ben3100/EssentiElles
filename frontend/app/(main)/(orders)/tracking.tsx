import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { orderService } from '../../../src/services/api';
import { Order } from '../../../src/models/types';
import StatusBadge from '../../../src/components/ui/StatusBadge';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

const STATUS_STEPS = ['confirmed', 'preparing', 'shipped', 'delivered'];

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      orderService.getById(id)
        .then(res => setOrder(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
    </SafeAreaView>
  );

  if (!order) return null;

  const currentIdx = STATUS_STEPS.indexOf(order.status);

  const stepConfig: Record<string, { icon: string; label: string }> = {
    confirmed:  { icon: 'checkmark-circle-outline', label: 'Confirmée' },
    preparing:  { icon: 'construct-outline',         label: 'Préparation' },
    shipped:    { icon: 'car-outline',               label: 'Expédiée' },
    delivered:  { icon: 'home-outline',              label: 'Livrée' },
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi de commande</Text>
        <StatusBadge status={order.status} small />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order info */}
        <View style={styles.card}>
          <Text style={styles.orderNum}>{order.orderNumber}</Text>
          <Text style={styles.orderDate}>Commandé le {formatDate(order.createdAt)}</Text>
          {order.trackingNumber ? (
            <View style={styles.row}>
              <Ionicons name="barcode-outline" size={14} color={Colors.textTertiary} />
              <Text style={styles.trackingNum}> {order.trackingNumber}</Text>
            </View>
          ) : null}
          {order.estimatedDelivery ? (
            <View style={styles.row}>
              <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
              <Text style={styles.estimatedText}> Livraison estimée : {formatDate(order.estimatedDelivery)}</Text>
            </View>
          ) : null}
        </View>

        {/* Progress */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Progression</Text>
          <View style={styles.progressRow}>
            {STATUS_STEPS.map((step, idx) => {
              const done = idx <= currentIdx;
              const current = idx === currentIdx;
              const cfg = stepConfig[step];
              return (
                <View key={step} style={styles.stepWrap}>
                  {idx > 0 && <View style={[styles.line, done && styles.lineDone]} />}
                  <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]}>
                    <Ionicons name={cfg.icon as any} size={16} color={done ? Colors.textInverse : Colors.textTertiary} />
                  </View>
                  <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{cfg.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Articles commandés</Text>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
              <Text style={styles.itemQty}>×{item.quantity}</Text>
              <Text style={styles.itemPrice}>{item.totalPrice.toFixed(2)} €</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{order.total.toFixed(2)} €</Text>
          </View>
        </View>

        {/* Timeline */}
        {order.timeline && order.timeline.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Historique</Text>
            {[...order.timeline].reverse().map((event, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {idx < order.timeline.length - 1 && <View style={styles.timelineLine} />}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineDesc}>{event.description}</Text>
                  <Text style={styles.timelineDate}>{formatDate(event.date)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  headerTitle: { ...Typography.subtitle, color: Colors.textPrimary, flex: 1 },
  content: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.card },
  orderNum: { ...Typography.subtitle, color: Colors.textPrimary, fontFamily: 'Poppins_700Bold' },
  orderDate: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  trackingNum: { fontSize: 12, color: Colors.textTertiary },
  estimatedText: { fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_500Medium' },
  sectionTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginBottom: Spacing.md },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepWrap: { alignItems: 'center', flex: 1, position: 'relative' },
  line: { position: 'absolute', top: 18, right: '50%', width: '100%', height: 2, backgroundColor: Colors.borderMedium, zIndex: 0 },
  lineDone: { backgroundColor: Colors.success },
  dot: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.borderMedium, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  dotDone: { backgroundColor: Colors.success },
  dotCurrent: { backgroundColor: Colors.primary },
  stepLabel: { fontSize: 10, color: Colors.textTertiary, marginTop: 4, textAlign: 'center' },
  stepLabelDone: { color: Colors.success, fontFamily: 'Poppins_500Medium' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  itemName: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  itemQty: { fontSize: 13, color: Colors.textSecondary, marginRight: 12 },
  itemPrice: { fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_600SemiBold' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8 },
  totalLabel: { ...Typography.subtitle, color: Colors.textPrimary },
  totalValue: { ...Typography.h4, color: Colors.primary },
  timelineItem: { flexDirection: 'row', marginBottom: Spacing.sm, position: 'relative' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, marginTop: 5, marginRight: 12, zIndex: 1 },
  timelineLine: { position: 'absolute', left: 4, top: 15, width: 2, height: 40, backgroundColor: Colors.borderLight },
  timelineContent: { flex: 1 },
  timelineDesc: { fontSize: 13, color: Colors.textPrimary, fontFamily: 'Poppins_500Medium' },
  timelineDate: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
});
