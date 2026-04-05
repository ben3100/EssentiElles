import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ScrollView, RefreshControl, ActivityIndicator, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../../src/services/api';
import { Order } from '../../src/models/types';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import StatusBadge from '../../src/components/ui/StatusBadge';

const ORDER_STATUSES = [
  { key: 'confirmed', label: 'Confirmée', color: Colors.info },
  { key: 'preparing', label: 'Préparation', color: Colors.warning },
  { key: 'shipped', label: 'Expédiée', color: Colors.primary },
  { key: 'delivered', label: 'Livrée', color: Colors.success },
  { key: 'cancelled', label: 'Annulée', color: Colors.error },
];

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await adminService.getOrders();
      setOrders(res.data);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const handleStatusUpdate = (order: Order) => {
    const options = ORDER_STATUSES.map(s => ({
      text: s.label,
      onPress: async () => {
        try {
          await adminService.updateOrderStatus(order.id, s.key);
          load();
          Alert.alert('✓', `Statut mis à jour: ${s.label}`);
        } catch { Alert.alert('Erreur', 'Impossible de mettre à jour'); }
      },
    }));
    Alert.alert(
      `Changer le statut de ${order.orderNumber}`,
      'Sélectionnez le nouveau statut :',
      [...options, { text: 'Annuler', style: 'cancel' as any }]
    );
  };

  const filterOptions = ['all', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
  const filterLabels: Record<string, string> = {
    all: 'Toutes', confirmed: 'Confirmées', preparing: 'Préparation',
    shipped: 'Expédiées', delivered: 'Livrées', cancelled: 'Annulées',
  };
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Gestion des commandes</Text>
          <Text style={styles.pageSubtitle}>{orders.length} commande(s) au total</Text>
        </View>
      </View>

      {/* Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }}>
          {filterOptions.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{filterLabels[f]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.rowIcon}>
                  <Ionicons name="bag-outline" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName}>{item.orderNumber}</Text>
                  <Text style={styles.rowSub}>{formatDate(item.createdAt)} — {item.items?.length} article(s)</Text>
                  <Text style={styles.rowPrice}>{item.total.toFixed(2)} €</Text>
                </View>
              </View>
              <View style={styles.rowActions}>
                <StatusBadge status={item.status} small />
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={() => handleStatusUpdate(item)}
                >
                  <Ionicons name="swap-horizontal-outline" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.surface },
  pageTitle: { ...Typography.h4, color: Colors.textPrimary },
  pageSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  filterScroll: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  chip: { borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.borderLight, paddingHorizontal: 12, paddingVertical: 6 },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  list: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: Spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 8, ...Shadow.card },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  rowIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowName: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary },
  rowSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  rowPrice: { fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_600SemiBold', marginTop: 2 },
  rowActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  updateBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
});
