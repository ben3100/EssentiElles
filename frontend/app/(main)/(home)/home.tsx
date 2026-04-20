import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../../src/store/authStore';
import { subscriptionService, orderService, notificationService, offerService } from '../../../src/services/api';
import { Subscription, Order, Notification, Offer } from '../../../src/models/types';
import SectionHeader from '../../../src/components/layout/SectionHeader';
import SubscriptionCard from '../../../src/components/cards/SubscriptionCard';
import OrderCard from '../../../src/components/cards/OrderCard';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

const { width } = Dimensions.get('window');

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '🌅 Bonjour';
  if (h < 18) return '☀️ Bon après-midi';
  return '🌙 Bonsoir';
}

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [subsRes, ordersRes, notifRes, offersRes] = await Promise.allSettled([
        subscriptionService.getAll(),
        orderService.getAll(),
        notificationService.getAll(),
        offerService.getAll(),
      ]);
      if (subsRes.status === 'fulfilled') setSubscriptions(subsRes.value.data);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.slice(0, 3));
      if (notifRes.status === 'fulfilled') setUnreadCount(notifRes.value.data.filter((n: Notification) => !n.isRead).length);
      if (offersRes.status === 'fulfilled') setOffers(offersRes.value.data.slice(0, 3));
    } catch (e) {}
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const nextDelivery = activeSubs.sort((a, b) =>
    new Date(a.nextDeliveryDate).getTime() - new Date(b.nextDeliveryDate).getTime()
  )[0];
  const daysLeft = nextDelivery ? daysUntil(nextDelivery.nextDeliveryDate) : null;

  return (
    <View style={styles.container}>
      <ScrollView
        testID="home-screen"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Modern Header with Gradient */}
        <LinearGradient
          colors={[Colors.primary, Colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View>
                  <Text style={styles.greeting}>{getGreeting()}</Text>
                  <Text style={styles.userName}>{user?.firstName || 'Utilisatrice'} ✨</Text>
                </View>
                <TouchableOpacity
                  testID="home-notifications-btn"
                  onPress={() => router.push('/(main)/notifications')}
                  style={styles.notifBtn}
                >
                  <Ionicons name="notifications-outline" size={26} color={Colors.textInverse} />
                  {unreadCount > 0 && (
                    <View testID="home-notification-badge" style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          {/* Next Delivery Card */}
          {nextDelivery ? (
            <View style={styles.section}>
              <SectionHeader title="Prochaine livraison" />
              <TouchableOpacity
                testID="home-next-delivery-card"
                style={styles.deliveryCard}
                onPress={() => router.push('/(main)/subscriptions')}
                activeOpacity={0.9}
              >
                <View style={styles.deliveryLeft}>
                  <View style={styles.deliveryIconWrap}>
                    <Ionicons name="cube-outline" size={28} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.deliveryProduct} numberOfLines={1}>
                      {nextDelivery.product?.name || 'Votre abonnement'}
                    </Text>
                    <Text style={styles.deliveryDate}>
                      {daysLeft !== null
                        ? daysLeft <= 0 ? "Livraison aujourd'hui !" : daysLeft === 1 ? 'Demain' : `Dans ${daysLeft} jours`
                        : '—'
                      }
                    </Text>
                    <Text style={styles.deliveryFreq}>
                      {nextDelivery.frequency === 'weekly' ? 'Hebdomadaire' : nextDelivery.frequency === 'biweekly' ? 'Bi-mensuel' : 'Mensuel'} • ×{nextDelivery.quantity}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.section}>
              <TouchableOpacity
                testID="home-start-subscription-btn"
                style={styles.noSubCard}
                onPress={() => router.push('/(main)/catalog')}
              >
                <Ionicons name="add-circle-outline" size={32} color={Colors.primary} />
                <Text style={styles.noSubText}>Créer votre premier abonnement</Text>
                <Text style={styles.noSubSub}>Parcourez le catalogue et abonnez-vous</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Active Subscriptions */}
          {activeSubs.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title={`Abonnements actifs (${activeSubs.length})`}
                actionLabel="Voir tout"
                onAction={() => router.push('/(main)/subscriptions')}
              />
              {activeSubs.slice(0, 2).map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onPress={() => router.push('/(main)/subscriptions')}
                />
              ))}
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.section}>
            <SectionHeader title="Accès rapide" />
            <View style={styles.quickActions}>
              {[
                { icon: 'grid-outline', label: 'Catalogue', route: '/(main)/catalog' },
                { icon: 'cube-outline', label: 'Commandes', route: '/(main)/orders' },
                { icon: 'receipt-outline', label: 'Factures', route: '/(main)/invoices' },
                { icon: 'pricetag-outline', label: 'Offres', route: '/(main)/offers' },
              ].map(item => (
                <TouchableOpacity
                  key={item.label}
                  testID={`home-quick-action-${item.label.toLowerCase()}`}
                  style={styles.quickBtn}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={styles.quickIconWrap}>
                    <Ionicons name={item.icon as any} size={22} color={Colors.primary} />
                  </View>
                  <Text style={styles.quickLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Offers */}
          {offers.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Offres du moment"
                actionLabel="Voir tout"
                onAction={() => router.push('/(main)/offers')}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -Spacing.screen }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: Spacing.screen, gap: 12 }}>
                  {offers.map(offer => (
                    <TouchableOpacity
                      testID={`home-offer-${offer.id}`}
                      key={offer.id}
                      style={[styles.offerCard, { backgroundColor: offer.color }]}
                      onPress={() => router.push('/(main)/offers')}
                    >
                      {offer.badgeText && (
                        <View style={styles.offerBadge}>
                          <Text style={styles.offerBadgeText}>{offer.badgeText}</Text>
                        </View>
                      )}
                      <Text style={styles.offerDiscount}>-{offer.discount}%</Text>
                      <Text style={styles.offerTitle} numberOfLines={2}>{offer.title}</Text>
                      <Text style={styles.offerDesc} numberOfLines={2}>{offer.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Recent Orders */}
          {orders.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Commandes récentes"
                actionLabel="Voir tout"
                onAction={() => router.push('/(main)/orders')}
              />
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onPress={() => router.push({ pathname: '/(main)/tracking', params: { id: order.id } } as any)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerGradient: { 
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { 
    fontSize: 15, 
    fontFamily: 'Poppins_400Regular', 
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: { 
    fontSize: 28, 
    fontFamily: 'Poppins_700Bold', 
    color: Colors.textInverse,
  },
  notifBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative',
  },
  badge: { 
    position: 'absolute', 
    top: 4, 
    right: 4, 
    minWidth: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: Colors.accent, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  badgeText: { 
    fontSize: 11, 
    color: Colors.textInverse, 
    fontFamily: 'Poppins_700Bold' 
  },
  content: { paddingHorizontal: Spacing.screen, paddingBottom: Spacing.xl, marginTop: -12 },
  section: { marginTop: Spacing.xl },
  deliveryCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: Colors.card, 
    borderRadius: BorderRadius.xl, 
    padding: Spacing.lg,
    ...Shadow.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  deliveryLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  deliveryIconWrap: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    backgroundColor: Colors.primaryPale, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 14 
  },
  deliveryProduct: { 
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: Colors.textPrimary, 
    maxWidth: 200 
  },
  deliveryDate: { 
    fontSize: 16, 
    color: Colors.primary, 
    fontFamily: 'Poppins_700Bold', 
    marginTop: 4 
  },
  deliveryFreq: { 
    fontSize: 13, 
    color: Colors.textSecondary, 
    fontFamily: 'Poppins_400Regular', 
    marginTop: 2 
  },
  noSubCard: { 
    backgroundColor: Colors.surface, 
    borderRadius: BorderRadius.xl, 
    padding: Spacing.xl, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  noSubText: { ...Typography.subtitle, color: Colors.primaryDark, marginTop: Spacing.sm, fontFamily: 'Poppins_600SemiBold' },
  noSubSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickBtn: { alignItems: 'center', flex: 1 },
  quickIconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 6, ...Shadow.card },
  quickLabel: { fontSize: 11, color: Colors.textSecondary, fontFamily: 'Poppins_500Medium', textAlign: 'center' },
  offerCard: { width: 200, borderRadius: BorderRadius.lg, padding: Spacing.md, minHeight: 110 },
  offerBadge: { backgroundColor: Colors.primary, borderRadius: BorderRadius.pill, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6 },
  offerBadgeText: { fontSize: 9, color: Colors.textInverse, fontFamily: 'Poppins_600SemiBold' },
  offerDiscount: { fontSize: 28, fontFamily: 'Poppins_700Bold', color: Colors.primaryDark },
  offerTitle: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginTop: 2 },
  offerDesc: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
});
