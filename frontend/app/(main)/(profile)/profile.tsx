import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../src/store/authStore';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  route?: string;
  action?: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter', style: 'destructive',
          onPress: async () => { await logout(); router.replace('/(auth)/login' as any); }
        }
      ]
    );
  };

  const initials = user
    ? `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase()
    : 'U';

  const sections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Mon compte',
      items: [
        { icon: 'location-outline',  label: 'Mes adresses', subtitle: 'Gérer vos adresses de livraison', route: '/(main)/addresses' },
        { icon: 'receipt-outline',   label: 'Mes factures',  subtitle: 'Historique de facturation',      route: '/(main)/invoices' },
        { icon: 'settings-outline',  label: 'Paramètres',    subtitle: 'Profil, notifications, compte',  route: '/(main)/settings' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Aide & Support', subtitle: 'FAQ et tickets de support', route: '/(main)/support' },
      ],
    },
    {
      title: 'Compte',
      items: [
        { icon: 'log-out-outline', label: 'Déconnexion', action: handleLogout, danger: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone ? <Text style={styles.phone}>{user.phone}</Text> : null}
        </View>

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, idx) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity
                    testID={`profile-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    style={styles.menuItem}
                    onPress={() => { if (item.action) item.action(); else if (item.route) router.push(item.route as any); }}
                  >
                    <View style={[styles.menuIcon, item.danger && { backgroundColor: Colors.errorBg }]}>
                      <Ionicons name={item.icon as any} size={20} color={item.danger ? Colors.error : Colors.primary} />
                    </View>
                    <View style={styles.menuLabel}>
                      <Text style={[styles.menuText, item.danger && { color: Colors.error }]}>{item.label}</Text>
                      {item.subtitle ? <Text style={styles.menuSub}>{item.subtitle}</Text> : null}
                    </View>
                    {!item.danger && <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />}
                  </TouchableOpacity>
                  {idx < section.items.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>Livrella v1.0 🌸</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: 'center', paddingVertical: Spacing.xl, paddingHorizontal: Spacing.screen, backgroundColor: Colors.primaryPale },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  avatarText: { fontSize: 32, fontFamily: 'Poppins_700Bold', color: Colors.textInverse },
  name: { ...Typography.h4, color: Colors.textPrimary },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  phone: { fontSize: 13, color: Colors.textTertiary, marginTop: 2 },
  section: { paddingHorizontal: Spacing.screen, marginTop: Spacing.lg },
  sectionTitle: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Poppins_600SemiBold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.card },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 14 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1 },
  menuText: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_500Medium' },
  menuSub: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 64 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textTertiary, paddingVertical: Spacing.xl },
});
