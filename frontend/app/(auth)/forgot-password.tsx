import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppTextField from '../../src/components/ui/AppTextField';
import PrimaryButton from '../../src/components/ui/PrimaryButton';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing } from '../../src/constants/spacing';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Email requis', 'Veuillez saisir votre adresse email');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity testID="forgot-back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.iconWrap}>
          <Ionicons name="lock-open-outline" size={48} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Mot de passe oublié ?</Text>
        <Text style={styles.subtitle}>
          {sent
            ? "Un email de réinitialisation a été envoyé si ce compte existe."
            : "Saisissez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe."
          }
        </Text>

        {!sent ? (
          <>
            <AppTextField
              testID="forgot-email-input"
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <PrimaryButton
              testID="forgot-send-btn"
              label="Envoyer le lien"
              onPress={handleSend}
              loading={loading}
              style={{ marginTop: Spacing.md }}
            />
          </>
        ) : (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <Text style={styles.successText}>Email envoyé ! Vérifiez votre boîte de réception.</Text>
          </View>
        )}

        <TouchableOpacity testID="forgot-back-login-btn" onPress={() => router.replace('/(auth)/login')} style={styles.backLogin}>
          <Text style={styles.backLoginText}>← Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.xl },
  backBtn: { marginBottom: Spacing.xl },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg, alignSelf: 'flex-start' },
  title: { ...Typography.h2, color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 24 },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.successBg, borderRadius: 12, padding: Spacing.md, gap: 12, marginBottom: Spacing.lg },
  successText: { flex: 1, ...Typography.body, color: Colors.success, fontFamily: 'Poppins_500Medium' },
  backLogin: { marginTop: Spacing.lg },
  backLoginText: { ...Typography.body, color: Colors.primary, fontFamily: 'Poppins_500Medium' },
});
