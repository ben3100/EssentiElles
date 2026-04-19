import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  const params = useLocalSearchParams<{ category?: string }>();
  const routeCategory = typeof params.category === 'string' ? params.category : null;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(routeCategory);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'discount'>('popular');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
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

  useEffect(() => {
    setSelectedCat(routeCategory);
  }, [routeCategory]);

  useEffect(() => { load(selectedCat, search); }, [selectedCat, load]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length >= 2 || text.length === 0) load(selectedCat, text);
  };

  const onRefresh = () => { setRefreshing(true); load(selectedCat, search); };

  const filteredAndSortedProducts = products
    .filter((p) => {
      if (inStockOnly && !p.inStock) return false;
      if (featuredOnly && !p.isFeatured) return false;
      if (maxPrice !== null && p.subscriptionPrice > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.subscriptionPrice - b.subscriptionPrice;
      if (sortBy === 'priceDesc') return b.subscriptionPrice - a.subscriptionPrice;
      if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
      return b.reviewCount - a.reviewCount;
    });

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

      <View style={styles.advancedHeader}>
        <TouchableOpacity style={styles.advancedToggle} onPress={() => setShowAdvancedFilters(v => !v)}>
          <Ionicons name="options-outline" size={16} color={Colors.primaryDark} />
          <Text style={styles.advancedToggleText}>Filtres avancés</Text>
          <Ionicons name={showAdvancedFilters ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.primaryDark} />
        </TouchableOpacity>
      </View>

      {showAdvancedFilters && (
        <View style={styles.advancedPanel}>
          <Text style={styles.filterSectionTitle}>Tri</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
            {[
              { key: 'popular', label: 'Populaires' },
              { key: 'priceAsc', label: 'Prix croissant' },
              { key: 'priceDesc', label: 'Prix décroissant' },
              { key: 'discount', label: 'Meilleures promos' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.optionChip, sortBy === option.key && styles.optionChipActive]}
                onPress={() => setSortBy(option.key as typeof sortBy)}
              >
                <Text style={[styles.optionChipText, sortBy === option.key && styles.optionChipTextActive]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.filterSectionTitle, { marginTop: Spacing.sm }]}>Affinage</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity style={[styles.optionChip, inStockOnly && styles.optionChipActive]} onPress={() => setInStockOnly(v => !v)}>
              <Text style={[styles.optionChipText, inStockOnly && styles.optionChipTextActive]}>En stock uniquement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionChip, featuredOnly && styles.optionChipActive]} onPress={() => setFeaturedOnly(v => !v)}>
              <Text style={[styles.optionChipText, featuredOnly && styles.optionChipTextActive]}>Produits vedettes</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.filterSectionTitle, { marginTop: Spacing.sm }]}>Prix max abonnement</Text>
          <View style={styles.toggleRow}>
            {[15, 25, 40].map((price) => (
              <TouchableOpacity
                key={price}
                style={[styles.optionChip, maxPrice === price && styles.optionChipActive]}
                onPress={() => setMaxPrice((prev) => (prev === price ? null : price))}
              >
                <Text style={[styles.optionChipText, maxPrice === price && styles.optionChipTextActive]}>{`≤ ${price} €`}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={() => { setInStockOnly(false); setFeaturedOnly(false); setMaxPrice(null); setSortBy('popular'); }}>
              <Text style={styles.clearFiltersText}>Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
          data={filteredAndSortedProducts}
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
  advancedHeader: { paddingHorizontal: Spacing.screen, marginBottom: Spacing.sm },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryPale,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  advancedToggleText: { ...Typography.bodySmall, color: Colors.primaryDark, fontFamily: 'Poppins_500Medium' },
  advancedPanel: {
    marginHorizontal: Spacing.screen,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  filterSectionTitle: { ...Typography.caption, color: Colors.textSecondary, marginBottom: 6 },
  sortRow: { gap: 8 },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  optionChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionChipText: { ...Typography.caption, color: Colors.textSecondary, fontFamily: 'Poppins_500Medium' },
  optionChipTextActive: { color: Colors.textInverse },
  clearFiltersBtn: { justifyContent: 'center', paddingHorizontal: 6 },
  clearFiltersText: { ...Typography.caption, color: Colors.primaryDark, textDecorationLine: 'underline' },
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
