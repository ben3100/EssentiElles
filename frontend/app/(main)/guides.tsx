import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { BorderRadius, Shadow, Spacing, Typography } from '../../src/constants/spacing';

type GuideItem = {
  key: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  action: () => void;
};

export default function GuidesScreen() {
  const router = useRouter();

  const guides: GuideItem[] = [
    {
      key: 'postpartum',
      title: 'Routine postpartum',
      description: 'Apaisez, hydratez et planifiez vos essentiels pour les premières semaines.',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
      ctaLabel: 'Voir la sélection',
      action: () => router.push('/(main)/catalog'),
    },
    {
      key: 'maternity',
      title: 'Préparer son sac maternité',
      description: 'Une checklist simple pour ne rien oublier avant le départ à la maternité.',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      ctaLabel: 'Construire mon abonnement',
      action: () => router.push('/(main)/subscriptions'),
    },
    {
      key: 'daily-care',
      title: 'Hygiène intime quotidienne',
      description: 'Des gestes doux pour rester confortable chaque jour, sans surcharge.',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
      ctaLabel: 'Explorer les essentiels',
      action: () => router.push({ pathname: '/(main)/catalog', params: { category: 'feminine-hygiene' } } as any),
    },
    {
      key: 'baby',
      title: 'Produits indispensables bébé',
      description: 'Les repères utiles pour composer une base simple, douce et rassurante.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
      ctaLabel: 'Voir la catégorie bébé',
      action: () => router.push({ pathname: '/(main)/catalog', params: { category: 'baby' } } as any),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Conseils & routines</Text>
          <Text style={styles.heroTitle}>Des repères simples pour prendre soin de vous et de votre famille.</Text>
          <Text style={styles.heroBody}>
            Des routines courtes, réalistes et pensées pour accompagner l abonnement sans transformer l app en simple catalogue.
          </Text>
        </View>

        <View style={styles.calloutRow}>
          <View style={styles.calloutCard}>
            <View style={[styles.calloutIcon, { backgroundColor: Colors.primaryPale }]}>
              <Ionicons name="repeat-outline" size={18} color={Colors.primaryDark} />
            </View>
            <Text style={styles.calloutTitle}>Routine régulière</Text>
            <Text style={styles.calloutText}>Préparez vos besoins récurrents et ajustez votre fréquence au fil du temps.</Text>
          </View>

          <View style={styles.calloutCard}>
            <View style={[styles.calloutIcon, { backgroundColor: Colors.accentSageSoft }]}>
              <Ionicons name="leaf-outline" size={18} color={Colors.accentSage} />
            </View>
            <Text style={styles.calloutTitle}>Moments apaisés</Text>
            <Text style={styles.calloutText}>Des gestes doux, moins de charge mentale, plus de clarté au quotidien.</Text>
          </View>
        </View>

        {guides.map((guide) => (
          <View key={guide.key} style={styles.guideCard}>
            <Image source={{ uri: guide.image }} style={styles.guideImage} />
            <View style={styles.guideBody}>
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <Text style={styles.guideDescription}>{guide.description}</Text>
              <TouchableOpacity style={styles.guideButton} onPress={guide.action} activeOpacity={0.92}>
                <Text style={styles.guideButtonText}>{guide.ctaLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.screen,
    paddingBottom: Spacing.xl,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.card,
  },
  heroEyebrow: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  heroTitle: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  heroBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 10,
  },
  calloutRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.xl,
  },
  calloutCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.card,
  },
  calloutIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  calloutTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  calloutText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  guideCard: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.card,
  },
  guideImage: {
    width: '100%',
    height: 210,
    backgroundColor: Colors.surfaceAlt,
  },
  guideBody: {
    padding: 18,
  },
  guideTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  guideDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  guideButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  guideButtonText: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
});
