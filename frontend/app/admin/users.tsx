import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch, RefreshControl, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../../src/services/api';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch {} finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const handleToggle = (id: string, name: string, current: boolean) => {
    Alert.alert(
      current ? `Désactiver ${name} ?` : `Activer ${name} ?`,
      current ? 'Ce compte sera suspendu.' : 'Ce compte sera réactivé.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: current ? 'Désactiver' : 'Activer', onPress: async () => {
          try { await adminService.toggleUser(id); load(); }
          catch { Alert.alert('Erreur', 'Impossible de modifier'); }
        }}
      ]
    );
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const customers = users.filter(u => u.role === 'customer').length;
  const admins = users.filter(u => u.role === 'admin').length;

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Gestion des utilisateurs</Text>
          <Text style={styles.pageSubtitle}>{customers} client(s) — {admins} admin(s)</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher par nom ou email..."
          placeholderTextColor={Colors.textPlaceholder}
        />
      </View>

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
          renderItem={({ item }) => {
            const initials = `${(item.firstName || '')[0] || ''}${(item.lastName || '')[0] || ''}`.toUpperCase();
            return (
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={[styles.avatar, item.role === 'admin' && { backgroundColor: Colors.primary }]}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.rowName}>{item.firstName} {item.lastName}</Text>
                      {item.role === 'admin' && (
                        <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>Admin</Text></View>
                      )}
                    </View>
                    <Text style={styles.rowEmail}>{item.email}</Text>
                    <Text style={styles.rowDate}>Inscrit le {formatDate(item.createdAt)}</Text>
                  </View>
                </View>
                {item.role !== 'admin' && (
                  <Switch
                    value={item.isActive !== false}
                    onValueChange={() => handleToggle(item.id, `${item.firstName}`, item.isActive !== false)}
                    trackColor={{ false: Colors.borderMedium, true: Colors.primaryLight }}
                    thumbColor={item.isActive !== false ? Colors.primary : Colors.textTertiary}
                  />
                )}
              </View>
            );
          }}
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
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, margin: Spacing.md, backgroundColor: Colors.surface, borderRadius: BorderRadius.md, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: Colors.borderLight },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: 8, ...Shadow.card },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontFamily: 'Poppins_600SemiBold', color: Colors.textInverse },
  rowName: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary },
  adminBadge: { backgroundColor: Colors.primaryPale, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  adminBadgeText: { fontSize: 10, color: Colors.primary, fontFamily: 'Poppins_600SemiBold' },
  rowEmail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  rowDate: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
});
