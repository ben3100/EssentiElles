import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';
import AppTextField from '../../src/components/ui/AppTextField';
import PrimaryButton from '../../src/components/ui/PrimaryButton';
import AppScreen from '../../src/components/ui/AppScreen';
import AppCard from '../../src/components/ui/AppCard';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius } from '../../src/constants/spacing';
import { User } from '../../src/models/types';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (!password) e.password = 'Mot de passe requis';
    else if (password.length < 6) e.password = '6 caractères minimum';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login(email.trim().toLowerCase(), password);
      await setAuth(res.data.token, res.data.user as User);
      router.replace('/(main)/(home)/home');
    } catch (err: any) {
      Alert.alert('Connexion impossible', err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen scrollable contentContainerStyle={styles.scroll}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <LinearGradient colors={[Colors.primaryPale, Colors.background]} style={styles.header}>
          <Text style={styles.appName}>🌸 Livrella</Text>
          <Text style={styles.title}>Bon retour !</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder à vos abonnements</Text>
        </LinearGradient>

        {/* Form */}
        <AppCard style={styles.form}>
          <AppTextField
            testID="login-email-input"
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            autoComplete="email"
            icon="mail-outline"
            error={errors.email}
          />
          <AppTextField
            testID="login-password-input"
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            icon="lock-closed-outline"
            secureTextEntry
            secureToggle
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            autoComplete="password"
            error={errors.password}
          />

          <TouchableOpacity
            testID="login-forgot-password-btn"
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <PrimaryButton
            testID="login-submit-btn"
            label="Se connecter"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
          />

          {/* Demo hint */}
          <View style={styles.demoHint}>
            <Text style={styles.demoText}>💡 Compte démo : sarah@example.com / password123</Text>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Pas encore de compte ? </Text>
            <TouchableOpacity testID="login-register-link" onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </AppCard>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: Spacing.lg },
  header: { padding: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.xxl, alignItems: 'center' },
  appName: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.primaryDark, marginBottom: Spacing.lg },
  title: { ...Typography.h2, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  form: {
    flex: 1,
    padding: Spacing.xl,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    marginTop: -Spacing.lg,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.md },
  forgotText: { ...Typography.bodySmall, color: Colors.primaryDeep, fontFamily: 'Poppins_500Medium' },
  demoHint: { backgroundColor: Colors.infoBg, borderRadius: BorderRadius.lg, padding: Spacing.smd, marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.borderLight },
  demoText: { fontSize: 11, color: Colors.info, fontFamily: 'Poppins_400Regular', textAlign: 'center' },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg },
  registerText: { ...Typography.body, color: Colors.textSecondary },
  registerLink: { ...Typography.bodyEmphasis, color: Colors.primaryDark },
});
