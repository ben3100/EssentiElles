import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../../src/services/api';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';
import StatusBadge from '../../src/components/ui/StatusBadge';

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const FREQ_LABELS: Record<string, string> = {
  weekly: 'Hebdomadaire',
  biweekly: '2 semaines',
  monthly: 'Mensuel',
};

export default function AdminSubscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    try {
      const res = await adminService.getSubscriptions();
      setSubs(res.data);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const filterOptions = ['all', 'active', 'paused', 'cancelled'];
  const filterLabels: Record<string, string> = {
    all: 'Tous', active: 'Actifs', paused: 'En pause', cancelled: 'Annulés',
  };
  const filtered = filter === 'all' ? subs : subs.filter(s => s.status === filter);

  const activeCount = subs.filter(s => s.status === 'active').length;
  const revenue = subs.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.totalPrice || 0), 0);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Gestion des abonnements</Text>
          <Text style={styles.pageSubtitle}>{activeCount} actif(s) — CA mensuel : {revenue.toFixed(2)} €</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Actifs', value: subs.filter(s => s.status === 'active').length, color: Colors.success },
          { label: 'En pause', value: subs.filter(s => s.status === 'paused').length, color: Colors.warning },
          { label: 'Annulés', value: subs.filter(s => s.status === 'cancelled').length, color: Colors.error },
        ].map(stat => (
          <View key={stat.label} style={[styles.statCard, { borderLeftColor: stat.color }]}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
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
                  <Ionicons name="repeat-outline" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowName} numberOfLines={1}>
                    Abonn. ×{item.quantity}
                  </Text>
                  <Text style={styles.rowSub}>
                    {FREQ_LABELS[item.frequency] || item.frequency} — {(item.totalPrice || 0).toFixed(2)} €
                  </Text>
                  <Text style={styles.rowDate}>Depuis le {formatDate(item.startDate)}</Text>
                </View>
              </View>
              <StatusBadge status={item.status} small />
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
  statsRow: { flexDirection: 'row', gap: 8, padding: Spacing.md },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, padding: Spacing.md, borderLeftWidth: 3, ...Shadow.card },
  statValue: { fontSize: 22, fontFamily: 'Poppins_700Bold' },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
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
  rowSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  rowDate: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
});
