import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { offerService } from '../../src/services/api';
import { Offer } from '../../src/models/types';
import EmptyState from '../../src/components/ui/EmptyState';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

export default function OffersScreen() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await offerService.getAll();
      setOffers(res.data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Offres du moment 🎁</Text>
      </View>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={offers}
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
              icon="pricetag-outline"
              title="Aucune offre"
              description="Revenez bientôt pour découvrir nos promotions"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: item.color || Colors.primaryPale }]}
              onPress={() => router.push('/(main)/catalog' as any)}
              activeOpacity={0.9}
            >
              <View style={styles.cardTop}>
                {item.badgeText && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badgeText}</Text>
                  </View>
                )}
                <Text style={styles.discount}>-{item.discount}%</Text>
              </View>
              <Text style={styles.offerTitle}>{item.title}</Text>
              <Text style={styles.offerDesc} numberOfLines={3}>{item.description}</Text>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>Découvrir →</Text>
              </View>
            </TouchableOpacity>
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
  card: { borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, minHeight: 160, ...Shadow.card },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  badge: { backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingHorizontal: 10, paddingVertical: 4, marginRight: 10 },
  badgeText: { fontSize: 11, color: Colors.textInverse, fontFamily: 'Poppins_600SemiBold' },
  discount: { fontSize: 40, fontFamily: 'Poppins_700Bold', color: Colors.primaryDark },
  offerTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 6 },
  offerDesc: { ...Typography.body, color: Colors.textSecondary },
  cta: { marginTop: Spacing.md, alignSelf: 'flex-start', borderBottomWidth: 2, borderBottomColor: Colors.primary },
  ctaText: { fontSize: 14, color: Colors.primaryDark, fontFamily: 'Poppins_600SemiBold' },
});
