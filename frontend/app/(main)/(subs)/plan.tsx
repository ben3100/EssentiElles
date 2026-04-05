import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { productService, addressService, subscriptionService } from '../../../src/services/api';
import { Product, Address } from '../../../src/models/types';
import PrimaryButton from '../../../src/components/ui/PrimaryButton';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

const freqOptions = [
  { key: 'weekly', label: 'Hebdomadaire', sublabel: 'Chaque semaine' },
  { key: 'biweekly', label: 'Bi-mensuel', sublabel: 'Toutes les 2 sem.' },
  { key: 'monthly', label: 'Mensuel', sublabel: 'Une fois/mois' },
];

export default function PlanScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedFreq, setSelectedFreq] = useState<string>('monthly');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, addrRes] = await Promise.all([
          productService.getById(productId!),
          addressService.getAll(),
        ]);
        setProduct(prodRes.data);
        setAddresses(addrRes.data);
        if (addrRes.data.length > 0) {
          const def = addrRes.data.find((a: Address) => a.isDefault) || addrRes.data[0];
          setSelectedAddress(def.id);
        }
        setSelectedFreq(prodRes.data.availableFrequencies?.[0] || 'monthly');
      } catch {
        Alert.alert('Erreur', 'Impossible de charger les données');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (productId) loadData();
  }, [productId]);

  const handleConfirm = async () => {
    if (!selectedAddress) {
      Alert.alert('Adresse requise', 'Veuillez sélectionner une adresse de livraison', [
        { text: 'Ajouter une adresse', onPress: () => router.push('/(main)/addresses' as any) },
        { text: 'Annuler' }
      ]);
      return;
    }
    setSubmitting(true);
    try {
      await subscriptionService.create({
        productId: productId!,
        addressId: selectedAddress,
        frequency: selectedFreq,
        quantity,
      });
      Alert.alert(
        '🎉 Abonnement créé !',
        'Votre abonnement a été créé avec succès. Votre première livraison arrive bientôt !',
        [{ text: 'Super !', onPress: () => router.replace('/(main)/subscriptions' as any) }]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.message || "Impossible de créer l'abonnement");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
    </SafeAreaView>
  );

  if (!product) return null;

  const total = product.subscriptionPrice * quantity;
  const freqData = freqOptions.find(f => f.key === selectedFreq);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Créer l'abonnement</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Product summary */}
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productBrand}>{product.brand}</Text>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productUnit}>{product.unit}</Text>
            </View>
            <View style={styles.productPrice}>
              <Text style={styles.priceLabel}>Prix abonné</Text>
              <Text style={styles.price}>{product.subscriptionPrice.toFixed(2)} €</Text>
            </View>
          </View>

          {/* Frequency */}
          <Text style={styles.sectionTitle}>Fréquence de livraison</Text>
          <View style={styles.freqRow}>
            {freqOptions
              .filter(f => product.availableFrequencies.includes(f.key as any))
              .map(f => (
                <TouchableOpacity
                  key={f.key}
                  style={[styles.freqCard, selectedFreq === f.key && styles.freqCardActive]}
                  onPress={() => setSelectedFreq(f.key)}
                >
                  <Text style={[styles.freqLabel, selectedFreq === f.key && styles.freqLabelActive]}>{f.label}</Text>
                  <Text style={[styles.freqSub, selectedFreq === f.key && styles.freqSubActive]}>{f.sublabel}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionTitle}>Quantité</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.min(10, quantity + 1))}>
              <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyTotal}>{(product.subscriptionPrice * quantity).toFixed(2)} €</Text>
          </View>

          {/* Address */}
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          {addresses.length === 0 ? (
            <TouchableOpacity style={styles.addAddrBtn} onPress={() => router.push('/(main)/addresses' as any)}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.addAddrText}>Ajouter une adresse</Text>
            </TouchableOpacity>
          ) : (
            addresses.map(addr => (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addrCard, selectedAddress === addr.id && styles.addrCardActive]}
                onPress={() => setSelectedAddress(addr.id)}
              >
                <Ionicons
                  name={selectedAddress === addr.id ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selectedAddress === addr.id ? Colors.primary : Colors.textTertiary}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.addrLabel}>{addr.label}{addr.isDefault ? ' (Principale)' : ''}</Text>
                  <Text style={styles.addrText}>{addr.street}, {addr.city} {addr.zipCode}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Summary */}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Récapitulatif</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fréquence</Text>
              <Text style={styles.summaryValue}>{freqData?.label}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantité</Text>
              <Text style={styles.summaryValue}>×{quantity}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>Gratuite 🚚</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.summaryTotalLabel}>Total / livraison</Text>
              <Text style={styles.summaryTotalValue}>{total.toFixed(2)} €</Text>
            </View>
          </View>

          <PrimaryButton
            label="Confirmer l'abonnement"
            onPress={handleConfirm}
            loading={submitting}
            style={{ marginBottom: Spacing.xl }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  headerTitle: { ...Typography.subtitle, color: Colors.textPrimary },
  content: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  productCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primaryPale, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg },
  productInfo: { flex: 1, marginRight: 8 },
  productBrand: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium', textTransform: 'uppercase' },
  productName: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginTop: 2 },
  productUnit: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  productPrice: { alignItems: 'flex-end' },
  priceLabel: { fontSize: 10, color: Colors.primaryDark, fontFamily: 'Poppins_400Regular' },
  price: { ...Typography.h4, color: Colors.primary },
  sectionTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  freqRow: { flexDirection: 'row', gap: 8 },
  freqCard: { flex: 1, alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.borderLight, padding: Spacing.sm, backgroundColor: Colors.surface },
  freqCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  freqLabel: { fontSize: 12, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary },
  freqLabelActive: { color: Colors.textInverse },
  freqSub: { fontSize: 10, color: Colors.textTertiary, marginTop: 2, textAlign: 'center' },
  freqSubActive: { color: Colors.primaryPale },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 22, fontFamily: 'Poppins_700Bold', color: Colors.textPrimary, minWidth: 36, textAlign: 'center' },
  qtyTotal: { ...Typography.subtitle, color: Colors.primary, fontFamily: 'Poppins_600SemiBold' },
  addAddrBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primaryPale, borderRadius: BorderRadius.md, borderStyle: 'dashed', borderWidth: 1.5, borderColor: Colors.primaryLight, padding: Spacing.md },
  addAddrText: { ...Typography.body, color: Colors.primary },
  addrCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.borderLight, padding: Spacing.md, marginBottom: 8 },
  addrCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryPale },
  addrLabel: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary },
  addrText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  summary: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.lg, ...Shadow.card },
  summaryTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginBottom: Spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.textPrimary, fontFamily: 'Poppins_500Medium' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 8, marginTop: 4, marginBottom: 0 },
  summaryTotalLabel: { ...Typography.subtitle, color: Colors.textPrimary },
  summaryTotalValue: { ...Typography.h4, color: Colors.primary },
});
