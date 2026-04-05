import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/constants/colors';
import { Typography, Spacing, BorderRadius } from '../../src/constants/spacing';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: 'https://static.prod-images.emergentagent.com/jobs/e6ee2148-1543-4c43-8db7-2adb7bb65eeb/images/02d0be2b5498e40c653746ccbb1d220910839794f8a4f2a512a91b34bbdb6c01.png',
    title: 'Vos essentiels,\nlivrés automatiquement',
    titleEn: 'Your essentials,\ndelivered automatically',
    desc: 'Ne manquez plus jamais de produits essentiels. Livrella s\'occupe de tout à votre place.',
    bg: Colors.primaryPale,
  },
  {
    id: '2',
    image: 'https://static.prod-images.emergentagent.com/jobs/e6ee2148-1543-4c43-8db7-2adb7bb65eeb/images/04b9e03647977f8b33d623d4604b49a5373bc411c14f4955280a1e5de032ded3.png',
    title: 'Votre fréquence,\nvos produits',
    titleEn: 'Your frequency,\nyour products',
    desc: 'Choisissez vos produits préférés et la fréquence de livraison : hebdomadaire, bi-mensuelle ou mensuelle.',
    bg: '#EAF4F7',
  },
  {
    id: '3',
    image: 'https://static.prod-images.emergentagent.com/jobs/e6ee2148-1543-4c43-8db7-2adb7bb65eeb/images/8cb0ca5cb24f7777c907acaa14664bc3da6f52b80c906a6631c3cfd5391e47ca.png',
    title: 'Modifiez, pausez,\nà tout moment',
    titleEn: 'Modify, pause,\nanytime',
    desc: 'Besoin de changer ? Mettez en pause, modifiez ou annulez votre abonnement en quelques secondes.',
    bg: '#F0ECF8',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem('livrella_onboarding_seen', 'true');
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('livrella_onboarding_seen', 'true');
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.imageContainer, { backgroundColor: item.bg }]}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity
          testID="onboarding-next-btn"
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>
              {currentIndex === slides.length - 1 ? 'Commencer →' : 'Suivant →'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {currentIndex < slides.length - 1 && (
          <TouchableOpacity testID="onboarding-skip-btn" onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  slide: { flex: 1 },
  imageContainer: { height: '52%', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  image: { width: width * 0.75, height: '85%' },
  textContainer: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, flex: 1 },
  title: { fontSize: 26, fontFamily: 'Poppins_700Bold', color: Colors.textPrimary, lineHeight: 34, marginBottom: Spacing.md },
  desc: { ...Typography.body, color: Colors.textSecondary, lineHeight: 24 },
  bottom: { paddingHorizontal: Spacing.xl, paddingBottom: 48, alignItems: 'center' },
  dots: { flexDirection: 'row', marginBottom: Spacing.lg, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.borderMedium },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  nextBtn: { width: '100%', borderRadius: BorderRadius.pill, overflow: 'hidden', marginBottom: 12 },
  nextGradient: { height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.pill },
  nextText: { ...Typography.button, color: Colors.textInverse },
  skipBtn: { paddingVertical: 12 },
  skipText: { ...Typography.body, color: Colors.textTertiary, fontFamily: 'Poppins_500Medium' },
});
