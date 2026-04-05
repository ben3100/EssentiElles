import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { subscriptionService } from '../../../src/services/api';
import { Subscription } from '../../../src/models/types';
import SubscriptionCard from '../../../src/components/cards/SubscriptionCard';
import EmptyState from '../../../src/components/ui/EmptyState';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius } from '../../../src/constants/spacing';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const load = useCallback(async () => {
    try {
      const res = await subscriptionService.getAll();
      setSubscriptions(res.data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const handlePause = (id: string) => {
    Alert.alert(
      'Mettre en pause ?',
      'Votre abonnement sera suspendu.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Mettre en pause', style: 'destructive',
          onPress: async () => {
            try { await subscriptionService.pause(id); load(); }
            catch { Alert.alert('Erreur', 'Impossible de mettre en pause'); }
          }
        }
      ]
    );
  };

  const handleResume = async (id: string) => {
    try { await subscriptionService.resume(id); load(); }
    catch { Alert.alert('Erreur', 'Impossible de reprendre'); }
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      "Annuler l'abonnement ?",
      'Cette action est irréversible.',
      [
        { text: 'Garder', style: 'cancel' },
        {
          text: 'Annuler', style: 'destructive',
          onPress: async () => {
            try { await subscriptionService.cancel(id); load(); }
            catch { Alert.alert('Erreur', "Impossible d'annuler"); }
          }
        }
      ]
    );
  };

  const filterOptions = [
    { key: 'all', label: 'Tous' },
    { key: 'active', label: 'Actifs' },
    { key: 'paused', label: 'En pause' },
    { key: 'cancelled', label: 'Annulés' },
  ];

  const filtered = filter === 'all' ? subscriptions : subscriptions.filter(s => s.status === filter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Abonnements</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(main)/catalog' as any)}
        >
          <Ionicons name="add" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {filterOptions.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.chip, filter === f.key && styles.chipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          testID="subscriptions-list"
          data={filtered}
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
              icon="repeat-outline"
              title="Aucun abonnement"
              description={filter === 'all' ? 'Parcourez le catalogue pour créer votre premier abonnement' : 'Aucun abonnement dans cette catégorie'}
              actionLabel={filter === 'all' ? 'Explorer le catalogue' : undefined}
              onAction={filter === 'all' ? () => router.push('/(main)/catalog' as any) : undefined}
            />
          }
          renderItem={({ item }) => (
            <SubscriptionCard
              subscription={item}
              onPress={() => {}}
              onPause={item.status === 'active' ? () => handlePause(item.id) : undefined}
              onResume={item.status === 'paused' ? () => handleResume(item.id) : undefined}
              onCancel={item.status !== 'cancelled' ? () => handleCancel(item.id) : undefined}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
  },
  title: { ...Typography.h3, color: Colors.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.screen, gap: 8, marginBottom: Spacing.sm },
  chip: { borderRadius: BorderRadius.pill, borderWidth: 1.5, borderColor: Colors.borderLight, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: Colors.surface },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  list: { padding: Spacing.screen, paddingBottom: Spacing.xl },
});
