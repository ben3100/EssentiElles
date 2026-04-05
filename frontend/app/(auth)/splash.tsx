import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/spacing';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(async () => {
      const seen = await AsyncStorage.getItem('livrella_onboarding_seen');
      if (seen) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(auth)/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryPale, Colors.secondary, Colors.background]}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={{ uri: 'https://static.prod-images.emergentagent.com/jobs/e6ee2148-1543-4c43-8db7-2adb7bb65eeb/images/f55d1e4ebfc00998a13400e3c4ea1b3fb088993bc07beb0d0ba1134a88f3fd07.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Livrella</Text>
        <Text style={styles.tagline}>Vos essentiels, livrés automatiquement</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>🌸 Simple • Pratique • Élégant</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: 20 },
  appName: { fontSize: 42, fontFamily: 'Poppins_700Bold', color: Colors.primaryDark, letterSpacing: -1 },
  tagline: { fontSize: 14, fontFamily: 'Poppins_400Regular', color: Colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 40 },
  footer: { position: 'absolute', bottom: 50 },
  footerText: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.textTertiary },
});
