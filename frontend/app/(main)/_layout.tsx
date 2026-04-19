import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  focused,
  color,
  focusedIcon,
  unfocusedIcon,
}: {
  focused: boolean;
  color: string;
  focusedIcon: IconName;
  unfocusedIcon: IconName;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons name={focused ? focusedIcon : unfocusedIcon} size={20} color={color} />
    </View>
  );
}

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
            <TabIcon focused={focused} color={color} focusedIcon="home" unfocusedIcon="home-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="(subs)/subscriptions"
        options={{
          title: 'Abonnement',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} focusedIcon="repeat" unfocusedIcon="repeat-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="(catalog)/catalog"
        options={{
          title: 'Catalogue',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} focusedIcon="grid" unfocusedIcon="grid-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Conseils',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} focusedIcon="book" unfocusedIcon="book-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)/profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={color} focusedIcon="person" unfocusedIcon="person-outline" />
          ),
        }}
      />
      {/* Hidden screens (accessible via navigation but not in tab bar) */}
      <Tabs.Screen name="(orders)/orders" options={{ href: null }} />
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
    height: 82,
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#2B2D42',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Poppins_500Medium',
    marginTop: 2,
  },
  iconWrap: {
    minWidth: 40,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryPale,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
});
