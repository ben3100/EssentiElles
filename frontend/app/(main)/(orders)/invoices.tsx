import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { invoiceService } from '../../../src/services/api';
import { Invoice } from '../../../src/models/types';
import EmptyState from '../../../src/components/ui/EmptyState';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  paid:    { label: 'Payée',      color: Colors.success, bg: Colors.successBg },
  draft:   { label: 'Brouillon',  color: Colors.textTertiary, bg: Colors.borderLight },
  sent:    { label: 'Envoyée',    color: Colors.info, bg: Colors.infoBg },
  overdue: { label: 'En retard',  color: Colors.error, bg: Colors.errorBg },
};

export default function InvoicesScreen() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await invoiceService.getAll();
      setInvoices(res.data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Factures</Text>
      </View>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          testID="invoices-list"
          data={invoices}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="Aucune facture"
              description="Vos factures apparaîtront ici après chaque commande"
            />
          }
          renderItem={({ item }) => {
            const status = statusConfig[item.status] || statusConfig.draft;
            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconWrap}>
                    <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
                  </View>
                  <View style={styles.invoiceInfo}>
                    <Text style={styles.invoiceNum}>{item.invoiceNumber}</Text>
                    <Text style={styles.invoiceDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sous-total</Text>
                  <Text style={styles.detailValue}>{item.subtotal.toFixed(2)} €</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>TVA (10%)</Text>
                  <Text style={styles.detailValue}>{item.tax.toFixed(2)} €</Text>
                </View>
                <View style={[styles.detailRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total TTC</Text>
                  <Text style={styles.totalValue}>{item.total.toFixed(2)} €</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  title: { ...Typography.h3, color: Colors.textPrimary },
  list: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadow.card },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  invoiceInfo: { flex: 1 },
  invoiceNum: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold' },
  invoiceDate: { fontSize: 12, color: Colors.textTertiary },
  statusBadge: { borderRadius: BorderRadius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontFamily: 'Poppins_600SemiBold' },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailLabel: { fontSize: 13, color: Colors.textSecondary },
  detailValue: { fontSize: 13, color: Colors.textPrimary, fontFamily: 'Poppins_500Medium' },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 8, marginTop: 4 },
  totalLabel: { ...Typography.subtitle, color: Colors.textPrimary },
  totalValue: { ...Typography.subtitle, color: Colors.primary, fontFamily: 'Poppins_700Bold' },
});
