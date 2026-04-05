import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Spacing, Shadow } from '../../constants/spacing';
import { Product } from '../../models/types';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  product: Product;
  onPress: () => void;
  onSubscribe?: () => void;
}

export default function ProductCard({ product, onPress, onSubscribe }: Props) {
  const discount = product.discountPercentage || Math.round((1 - product.subscriptionPrice / product.price) * 100);

  return (
    <TouchableOpacity testID={`product-card-${product.id}`} style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imgWrap}>
        <Image source={{ uri: product.images?.[0] }} style={styles.img} resizeMode="cover" />
        {product.isNewArrival && (
          <View style={[styles.badge, { backgroundColor: Colors.info }]}>
            <Text style={styles.badgeText}>Nouveau</Text>
          </View>
        )}
        {product.isBestSeller && (
          <View style={[styles.badge, styles.badgeBottom, { backgroundColor: Colors.primaryDark }]}>
            <Text style={styles.badgeText}>★ Best-seller</Text>
          </View>
        )}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.unit}>{product.unit}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.subPrice}>{product.subscriptionPrice.toFixed(2)} €</Text>
            <Text style={styles.regPrice}>{product.price.toFixed(2)} €</Text>
          </View>
          <TouchableOpacity
            testID={`product-subscribe-btn-${product.id}`}
            style={styles.btn}
            onPress={onSubscribe || onPress}
          >
            <Text style={styles.btnText}>S'abonner</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    margin: Spacing.xs,
    flex: 1,
    maxWidth: '50%',
    ...Shadow.card,
  },
  imgWrap: { width: '100%', aspectRatio: 1, backgroundColor: Colors.accent, position: 'relative' },
  img: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute', top: 8, left: 8,
    borderRadius: BorderRadius.pill, paddingHorizontal: 7, paddingVertical: 3,
  },
  badgeBottom: { top: undefined, bottom: 8 },
  badgeText: { fontSize: 9, color: Colors.textInverse, fontFamily: 'Poppins_600SemiBold' },
  discountBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.pill, paddingHorizontal: 7, paddingVertical: 3,
  },
  discountText: { fontSize: 10, color: Colors.textInverse, fontFamily: 'Poppins_700Bold' },
  info: { padding: 10 },
  brand: { fontSize: 10, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginTop: 2, marginBottom: 2 },
  unit: { fontSize: 10, color: Colors.textSecondary, fontFamily: 'Poppins_400Regular', marginBottom: 6 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  subPrice: { fontSize: 15, color: Colors.primary, fontFamily: 'Poppins_700Bold' },
  regPrice: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular', textDecorationLine: 'line-through' },
  btn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.pill,
    paddingVertical: 6, paddingHorizontal: 10,
  },
  btnText: { fontSize: 10, color: Colors.textInverse, fontFamily: 'Poppins_600SemiBold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rating: { fontSize: 11, color: Colors.warning, fontFamily: 'Poppins_500Medium' },
  reviewCount: { fontSize: 10, color: Colors.textTertiary, fontFamily: 'Poppins_400Regular', marginLeft: 2 },
});
