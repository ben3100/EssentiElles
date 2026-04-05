import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { productService, addressService } from '../../../src/services/api';
import { Product, Address } from '../../../src/models/types';
import PrimaryButton from '../../../src/components/ui/PrimaryButton';
import SecondaryButton from '../../../src/components/ui/SecondaryButton';
import { useCartStore } from '../../../src/store/cartStore';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../../src/constants/spacing';

const freqOptions = [
  { key: 'weekly', label: 'Hebdomadaire', sublabel: '/semaine' },
  { key: 'biweekly', label: '2 semaines', sublabel: '/2 sem.' },
  { key: 'monthly', label: 'Mensuel', sublabel: '/mois' },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedFreq, setSelectedFreq] = useState('monthly');

  useEffect(() => {
    if (id) {
      productService.getById(id)
        .then(res => { setProduct(res.data); setSelectedFreq(res.data.availableFrequencies?.[0] || 'monthly'); })
        .catch(() => Alert.alert('Erreur', 'Produit introuvable'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return (
    <SafeAreaView style={styles.safe}>
      <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />
    </SafeAreaView>
  );

  if (!product) return null;

  const discount = product.discountPercentage || Math.round((1 - product.subscriptionPrice / product.price) * 100);

  const handleSubscribe = async () => {
    try {
      const addrRes = await addressService.getAll();
      const addresses: Address[] = addrRes.data;
      if (addresses.length === 0) {
        Alert.alert(
          'Adresse requise',
          'Veuillez d\'abord ajouter une adresse de livraison',
          [{ text: 'Ajouter', onPress: () => router.push('/(main)/addresses' as any) }, { text: 'Annuler' }]
        );
        return;
      }
      router.push({ pathname: '/(main)/plan', params: { productId: product.id } } as any);
    } catch {
      router.push({ pathname: '/(main)/plan', params: { productId: product.id } } as any);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    Alert.alert('✓ Ajouté au panier', `${product.name} ×${quantity}`, [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Voir le panier', onPress: () => router.push('/(main)/cart' as any) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.imgWrap}>
          <Image source={{ uri: product.images?.[0] }} style={styles.img} resizeMode="cover" />
          <TouchableOpacity testID="product-detail-back-btn" style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Info */}
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.unit}>{product.unit}</Text>
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map(i => (
              <Ionicons key={i} name={i <= Math.floor(product.rating) ? 'star' : 'star-outline'} size={14} color={Colors.warning} />
            ))}
            <Text style={styles.ratingText}>{product.rating} ({product.reviewCount} avis)</Text>
          </View>

          {/* Pricing */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.subPriceLabel}>Prix abonné</Text>
              <Text style={styles.subPrice}>{product.subscriptionPrice.toFixed(2)} € <Text style={styles.perUnit}>/ unité</Text></Text>
            </View>
            <View style={styles.priceDivider} />
            <View>
              <Text style={styles.regPriceLabel}>Prix normal</Text>
              <Text style={styles.regPrice}>{product.price.toFixed(2)} €</Text>
            </View>
          </View>

          {/* Frequency */}
          <Text style={styles.sectionTitle}>Fréquence de livraison</Text>
          <View style={styles.freqRow}>
            {freqOptions
              .filter(f => product.availableFrequencies.includes(f.key as any))
              .map(f => (
                <TouchableOpacity
                  testID={`product-freq-${f.key}`}
                  key={f.key}
                  style={[styles.freqChip, selectedFreq === f.key && styles.freqChipActive]}
                  onPress={() => setSelectedFreq(f.key)}
                >
                  <Text style={[styles.freqText, selectedFreq === f.key && styles.freqTextActive]}>{f.label}</Text>
                  <Text style={[styles.freqSub, selectedFreq === f.key && styles.freqSubActive]}>{f.sublabel}</Text>
                </TouchableOpacity>
              ))}
          </View>

          {/* Quantity */}
          <Text style={styles.sectionTitle}>Quantité</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              testID="product-detail-qty-minus"
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text testID="product-detail-qty-value" style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              testID="product-detail-qty-plus"
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.min(10, quantity + 1))}
            >
              <Ionicons name="add" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyTotal}> = {(product.subscriptionPrice * quantity).toFixed(2)} €</Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          {/* CTA */}
          <PrimaryButton
            testID="product-subscribe-btn"
            label="S'abonner"
            onPress={handleSubscribe}
            style={{ marginTop: Spacing.lg }}
          />
          <SecondaryButton
            testID="product-add-to-cart-btn"
            label="Ajouter au panier"
            onPress={handleAddToCart}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  imgWrap: { width: '100%', aspectRatio: 1.2, backgroundColor: Colors.accent },
  img: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 48, left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  discountBadge: { position: 'absolute', top: 48, right: 16, backgroundColor: Colors.error, borderRadius: BorderRadius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  discountText: { fontSize: 13, color: Colors.textInverse, fontFamily: 'Poppins_700Bold' },
  content: { padding: Spacing.xl, backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
  brand: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium', textTransform: 'uppercase', letterSpacing: 1 },
  name: { ...Typography.h3, color: Colors.textPrimary, marginTop: 4, marginBottom: 4 },
  unit: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Poppins_400Regular', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  ratingText: { fontSize: 12, color: Colors.textTertiary, marginLeft: 6 },
  priceCard: { flexDirection: 'row', backgroundColor: Colors.primaryPale, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, alignItems: 'center' },
  priceDivider: { width: 1, height: 40, backgroundColor: Colors.primaryLight, marginHorizontal: Spacing.md },
  subPriceLabel: { fontSize: 11, color: Colors.primaryDark, fontFamily: 'Poppins_500Medium' },
  subPrice: { ...Typography.h4, color: Colors.primary },
  perUnit: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: Colors.primaryLight },
  regPriceLabel: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular' },
  regPrice: { fontSize: 16, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular', textDecorationLine: 'line-through' },
  sectionTitle: { ...Typography.subtitle, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  freqRow: { flexDirection: 'row', gap: 10 },
  freqChip: { flex: 1, alignItems: 'center', borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: Colors.borderLight, padding: Spacing.sm, backgroundColor: Colors.surface },
  freqChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  freqText: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', color: Colors.textPrimary },
  freqTextActive: { color: Colors.textInverse },
  freqSub: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular' },
  freqSubActive: { color: Colors.primaryPale },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 20, fontFamily: 'Poppins_700Bold', color: Colors.textPrimary, marginHorizontal: 20 },
  qtyTotal: { ...Typography.subtitle, color: Colors.primary, fontFamily: 'Poppins_600SemiBold', marginLeft: 12 },
  desc: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24 },
});
