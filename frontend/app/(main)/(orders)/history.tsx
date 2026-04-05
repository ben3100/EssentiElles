import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { orderService } from '../../../src/services/api';
import { Order } from '../../../src/models/types';
import OrderCard from '../../../src/components/cards/OrderCard';
import EmptyState from '../../../src/components/ui/EmptyState';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing } from '../../../src/constants/spacing';

export default function HistoryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await orderService.getAll();
      setOrders(res.data.filter((o: Order) => o.status === 'delivered'));
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique</Text>
      </View>
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={orders}
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
              icon="checkmark-circle-outline"
              title="Aucune livraison effectuée"
              description="Vos commandes livrées apparaîtront ici"
            />
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => router.push({ pathname: '/(main)/tracking', params: { id: item.id } } as any)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { ...Typography.h3, color: Colors.textPrimary },
  list: { padding: Spacing.screen, paddingBottom: Spacing.xl },
});
