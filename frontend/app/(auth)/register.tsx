import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../src/services/api';
import { useAuthStore } from '../../src/store/authStore';
import AppTextField from '../../src/components/ui/AppTextField';
import PrimaryButton from '../../src/components/ui/PrimaryButton';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing } from '../../src/constants/spacing';
import { User } from '../../src/models/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim()) e.lastName = 'Nom requis';
    if (!form.email.trim()) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.password) e.password = 'Mot de passe requis';
    else if (form.password.length < 6) e.password = '6 caractères minimum';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.register({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
      });
      await setAuth(res.data.token, res.data.user as User);
      router.replace('/(main)/(home)/home');
    } catch (err: any) {
      Alert.alert('Erreur d\'inscription', err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity testID="register-back-btn" onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez Livrella et simplifiez votre quotidien</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <AppTextField
                  testID="register-firstname-input"
                  label="Prénom"
                  value={form.firstName}
                  onChangeText={(v) => update('firstName', v)}
                  placeholder="Marie"
                  icon="person-outline"
                  error={errors.firstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppTextField
                  testID="register-lastname-input"
                  label="Nom"
                  value={form.lastName}
                  onChangeText={(v) => update('lastName', v)}
                  placeholder="Dupont"
                  icon="person-outline"
                  error={errors.lastName}
                />
              </View>
            </View>
            <AppTextField
              testID="register-email-input"
              label="Email"
              value={form.email}
              onChangeText={(v) => update('email', v)}
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
              testID="register-phone-input"
              label="Téléphone (optionnel)"
              value={form.phone}
              onChangeText={(v) => update('phone', v)}
              placeholder="+33 6 00 00 00 00"
              keyboardType="phone-pad"
              icon="call-outline"
            />
            <AppTextField
              testID="register-password-input"
              label="Mot de passe"
              value={form.password}
              onChangeText={(v) => update('password', v)}
              placeholder="••••••••"
              secureTextEntry
              secureToggle
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              autoComplete="password-new"
              icon="lock-closed-outline"
              error={errors.password}
            />
            <AppTextField
              testID="register-confirm-password-input"
              label="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChangeText={(v) => update('confirmPassword', v)}
              placeholder="••••••••"
              secureTextEntry
              secureToggle
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              autoComplete="password"
              icon="lock-closed-outline"
              error={errors.confirmPassword}
            />

            <PrimaryButton
              testID="register-submit-btn"
              label="Créer mon compte"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: Spacing.md }}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <TouchableOpacity testID="register-login-link" onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1 },
  header: { padding: Spacing.xl, paddingTop: Spacing.xl },
  backBtn: { marginBottom: Spacing.lg },
  title: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.sm },
  form: {
    flex: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: Spacing.md,
  },
  row: { flexDirection: 'row' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing.lg, paddingBottom: Spacing.xl },
  loginText: { ...Typography.body, color: Colors.textSecondary },
  loginLink: { ...Typography.bodyEmphasis, color: Colors.primaryDark },
});
