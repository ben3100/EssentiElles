import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}

const tabs: TabConfig[] = [
  { name: '(home)/home',       title: 'Accueil',      icon: 'home-outline',     iconFocused: 'home' },
  { name: '(catalog)/catalog', title: 'Catalogue',    icon: 'grid-outline',     iconFocused: 'grid' },
  { name: '(subs)/subscriptions', title: 'Abonnements', icon: 'repeat-outline', iconFocused: 'repeat' },
  { name: '(orders)/orders',   title: 'Commandes',    icon: 'cube-outline',     iconFocused: 'cube' },
  { name: '(profile)/profile', title: 'Profil',       icon: 'person-outline',   iconFocused: 'person' },
];

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="(home)/home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(catalog)/catalog"
        options={{
          title: 'Catalogue',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(subs)/subscriptions"
        options={{
          title: 'Abonnements',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'repeat' : 'repeat-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(orders)/orders"
        options={{
          title: 'Commandes',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'cube' : 'cube-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)/profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
      {/* Hidden screens (accessible via navigation but not in tab bar) */}
      <Tabs.Screen name="(catalog)/[id]" options={{ href: null }} />
      <Tabs.Screen name="(subs)/plan" options={{ href: null }} />
      <Tabs.Screen name="(orders)/tracking" options={{ href: null }} />
      <Tabs.Screen name="(orders)/invoices" options={{ href: null }} />
      <Tabs.Screen name="(orders)/history" options={{ href: null }} />
      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="offers" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="(profile)/settings" options={{ href: null }} />
      <Tabs.Screen name="(profile)/support" options={{ href: null }} />
      <Tabs.Screen name="(profile)/addresses" options={{ href: null }} />
      <Tabs.Screen name="(profile)/ticket" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
  },
});
