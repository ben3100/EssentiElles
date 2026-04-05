import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../../src/services/api';
import { Notification } from '../../src/models/types';
import EmptyState from '../../src/components/ui/EmptyState';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

const notifIcons: Record<string, { icon: string; color: string; bg: string }> = {
  delivery:     { icon: 'cube-outline',             color: Colors.primary,  bg: Colors.primaryPale },
  subscription: { icon: 'repeat-outline',           color: Colors.info,     bg: Colors.infoBg },
  promo:        { icon: 'pricetag-outline',          color: Colors.warning,  bg: Colors.warningBg },
  support:      { icon: 'chatbubble-ellipses-outline', color: Colors.success, bg: Colors.successBg },
  system:       { icon: 'notifications-outline',    color: Colors.textTertiary, bg: Colors.borderLight },
};

function formatDate(d?: string) {
  if (!d) return '';
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data);
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          data={notifications}
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
              icon="notifications-outline"
              title="Aucune notification"
              description="Vous serez notifié de vos livraisons et promotions"
            />
          }
          renderItem={({ item }) => {
            const cfg = notifIcons[item.type] || notifIcons.system;
            return (
              <TouchableOpacity
                testID={`notif-${item.id}`}
                style={[styles.card, !item.isRead && styles.cardUnread]}
                onPress={() => handleMarkRead(item.id)}
                activeOpacity={0.9}
              >
                <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                  <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
                </View>
                <View style={styles.content}>
                  <View style={styles.contentHeader}>
                    <Text style={styles.notifTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
                </View>
                {!item.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
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
  title: { ...Typography.h3, color: Colors.textPrimary, flex: 1 },
  markAllText: { fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_500Medium' },
  list: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  card: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  cardUnread: { backgroundColor: Colors.primaryPale, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  iconWrap: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 },
  content: { flex: 1 },
  contentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { flex: 1, ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginRight: 8 },
  date: { fontSize: 11, color: Colors.textTertiary },
  body: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: 8, marginTop: 4, flexShrink: 0 },
});
