import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Spacing, Shadow } from '../../constants/spacing';
import { Product } from '../../models/types';

interface Props {
  product: Product;
  onPress: () => void;
  onSubscribe?: () => void;
}

function getBenefits(product: Product): string[] {
  const tagBenefits = (product.tags || [])
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (tagBenefits.length > 0) {
    return tagBenefits;
  }

  const text = product.shortDescription || product.description || product.unit;
  return text
    .split(/[.,|]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);
}

export default function ProductCard({ product, onPress, onSubscribe }: Props) {
  const benefits = getBenefits(product);
  const hasRecommendation = product.isFeatured || product.isBestSeller;

  return (
    <TouchableOpacity testID={`product-card-${product.id}`} style={styles.card} onPress={onPress} activeOpacity={0.94}>
      <View style={styles.imageWrap}>
        {product.images?.[0] ? (
          <Image source={{ uri: product.images[0] }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>{product.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        {hasRecommendation ? (
          <View style={styles.recommendationBadge}>
            <Text style={styles.recommendationText}>Abonnement recommande</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
        {benefits.map((benefit) => (
          <Text key={`${product.id}-${benefit}`} style={styles.benefit} numberOfLines={1}>
            {benefit}
          </Text>
        ))}

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{product.subscriptionPrice.toFixed(2)} €</Text>
            <Text style={styles.compareAt}>{product.price.toFixed(2)} € ponctuel</Text>
          </View>

          <TouchableOpacity
            testID={`product-subscribe-btn-${product.id}`}
            style={styles.button}
            onPress={onSubscribe || onPress}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    margin: 6,
    flex: 1,
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.card,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 0.98,
    backgroundColor: Colors.surfaceAlt,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryPale,
  },
  imagePlaceholderText: {
    fontSize: 30,
    color: Colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  recommendationBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.primaryPale,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  recommendationText: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  title: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
  },
  benefit: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.md,
    gap: 8,
  },
  price: {
    ...Typography.button,
    color: Colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  compareAt: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  button: {
    minWidth: 86,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    ...Typography.bodySmall,
    color: Colors.textInverse,
    fontFamily: 'Poppins_500Medium',
  },
});
