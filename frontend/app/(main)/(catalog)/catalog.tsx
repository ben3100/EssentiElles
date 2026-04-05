import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { productService, categoryService } from '../../../src/services/api';
import { Product, Category } from '../../../src/models/types';
import ProductCard from '../../../src/components/cards/ProductCard';
import EmptyState from '../../../src/components/ui/EmptyState';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import { Colors } from '../../../src/constants/colors';
import { Typography, Spacing, BorderRadius } from '../../../src/constants/spacing';

export default function CatalogScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (catSlug?: string | null, searchQuery?: string) => {
    try {
      const [prodsRes, catsRes] = await Promise.allSettled([
        productService.getAll({ category: catSlug || undefined, search: searchQuery || undefined }),
        categoryService.getAll(),
      ]);
      if (prodsRes.status === 'fulfilled') setProducts(prodsRes.value.data.products);
      if (catsRes.status === 'fulfilled') setCategories(catsRes.value.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(selectedCat, search); }, [selectedCat]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length >= 2 || text.length === 0) load(selectedCat, text);
  };

  const onRefresh = () => { setRefreshing(true); load(selectedCat, search); };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Catalogue</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.textTertiary} style={{ marginRight: 8 }} />
        <TextInput
          testID="catalog-search-input"
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor={Colors.textPlaceholder}
          value={search}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); load(selectedCat, ''); }}>
            <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        <TouchableOpacity
          testID="catalog-filter-all"
          style={[styles.chip, !selectedCat && styles.chipActive]}
          onPress={() => setSelectedCat(null)}
        >
          <Text style={[styles.chipText, !selectedCat && styles.chipTextActive]}>Tout</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            testID={`catalog-filter-${cat.slug}`}
            key={cat.id}
            style={[styles.chip, selectedCat === cat.slug && styles.chipActive, { borderColor: cat.color }]}
            onPress={() => setSelectedCat(cat.slug === selectedCat ? null : cat.slug)}
          >
            <Ionicons name={cat.icon as any} size={13} color={selectedCat === cat.slug ? Colors.textInverse : Colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={[styles.chipText, selectedCat === cat.slug && styles.chipTextActive]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <FlatList
          testID="catalog-product-list"
          data={products}
          numColumns={2}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.grid}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Aucun produit trouvé"
              description="Essayez une autre catégorie ou recherche"
              actionLabel="Effacer les filtres"
              onAction={() => { setSearch(''); setSelectedCat(null); load(null, ''); }}
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push({ pathname: '/(main)/[id]', params: { id: item.id } } as any)}
              onSubscribe={() => router.push({ pathname: '/(main)/[id]', params: { id: item.id } } as any)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { ...Typography.h3, color: Colors.textPrimary },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.screen, marginBottom: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.pill,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  catScroll: { maxHeight: 44 },
  catContent: { paddingHorizontal: Spacing.screen, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: BorderRadius.pill, borderWidth: 1.5,
    borderColor: Colors.borderLight, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: Colors.surface, height: 36,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontFamily: 'Poppins_500Medium', color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
  grid: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.xl, paddingTop: Spacing.sm },
});
