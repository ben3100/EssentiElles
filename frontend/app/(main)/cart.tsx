import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../src/store/cartStore';
import { addressService, orderService } from '../../src/services/api';
import { Address } from '../../src/models/types';
import EmptyState from '../../src/components/ui/EmptyState';
import PrimaryButton from '../../src/components/ui/PrimaryButton';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius, Shadow } from '../../src/constants/spacing';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCartStore();
  const [ordering, setOrdering] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setOrdering(true);
    try {
      const addrRes = await addressService.getAll();
      const addresses: Address[] = addrRes.data;
      if (addresses.length === 0) {
        Alert.alert(
          'Adresse requise',
          'Veuillez d\'abord ajouter une adresse de livraison',
          [
            { text: 'Ajouter', onPress: () => router.push('/(main)/addresses' as any) },
            { text: 'Annuler' }
          ]
        );
        return;
      }
      const defAddr = addresses.find(a => a.isDefault) || addresses[0];
      const orderItems = items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.subscriptionPrice,
        totalPrice: i.product.subscriptionPrice * i.quantity,
      }));
      await orderService.create({ items: orderItems, addressId: defAddr.id });
      clearCart();
      Alert.alert(
        '🎉 Commande passée !',
        'Votre commande a été confirmée. Vous pouvez suivre sa progression.',
        [{ text: 'Voir mes commandes', onPress: () => router.push('/(main)/orders' as any) }]
      );
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de passer la commande');
    } finally {
      setOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Mon Panier</Text>
        </View>
        <EmptyState
          icon="bag-outline"
          title="Panier vide"
          description="Ajoutez des produits depuis le catalogue"
          actionLabel="Voir le catalogue"
          onAction={() => router.push('/(main)/catalog' as any)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Mon Panier ({itemCount()} article{itemCount() > 1 ? 's' : ''})</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Vider le panier ?', '', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Vider', style: 'destructive', onPress: clearCart }
          ])}
        >
          <Ionicons name="trash-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.product.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.imgPlaceholder}>
                <Ionicons name="cube-outline" size={24} color={Colors.primaryLight} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.brand}>{item.product.brand}</Text>
                <Text style={styles.name} numberOfLines={2}>{item.product.name}</Text>
                <Text style={styles.price}>{item.product.subscriptionPrice.toFixed(2)} €/unité</Text>
              </View>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
              >
                <Ionicons name={item.quantity === 1 ? 'trash-outline' : 'remove'} size={16} color={item.quantity === 1 ? Colors.error : Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyVal}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.lineTotal}>{(item.product.subscriptionPrice * item.quantity).toFixed(2)} €</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total ({itemCount()} articles)</Text>
              <Text style={styles.summaryValue}>{total().toFixed(2)} €</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>Gratuite 🚚</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total().toFixed(2)} €</Text>
            </View>
            <PrimaryButton
              label="Valider la commande"
              onPress={handleCheckout}
              loading={ordering}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm, gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  title: { ...Typography.h3, color: Colors.textPrimary, flex: 1 },
  list: { padding: Spacing.screen, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.card },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  imgPlaceholder: { width: 56, height: 56, borderRadius: BorderRadius.md, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 10, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium', textTransform: 'uppercase' },
  name: { ...Typography.bodySmall, color: Colors.textPrimary, fontFamily: 'Poppins_600SemiBold', marginTop: 2 },
  price: { fontSize: 13, color: Colors.primary, fontFamily: 'Poppins_600SemiBold', marginTop: 4 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  qtyVal: { fontSize: 16, fontFamily: 'Poppins_700Bold', color: Colors.textPrimary, minWidth: 24, textAlign: 'center' },
  lineTotal: { ...Typography.subtitle, color: Colors.primary, marginLeft: 8 },
  summary: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.sm, ...Shadow.card },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.textPrimary, fontFamily: 'Poppins_500Medium' },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 8, marginTop: 4, marginBottom: 0 },
  totalLabel: { ...Typography.subtitle, color: Colors.textPrimary },
  totalValue: { ...Typography.h4, color: Colors.primary },
});
