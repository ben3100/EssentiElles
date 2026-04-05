import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Shadow } from '../../constants/spacing';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width, height, style }: SkeletonBoxProps) {
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width ?? '100%', height, backgroundColor: Colors.borderLight, borderRadius: BorderRadius.sm, opacity: pulse },
        style,
      ]}
    />
  );
}

export function SkeletonProductCard() {
  return (
    <View style={styles.card}>
      <SkeletonBox height={160} style={{ borderRadius: BorderRadius.lg, marginBottom: 10 }} />
      <SkeletonBox height={12} width="50%" style={{ marginBottom: 6 }} />
      <SkeletonBox height={16} width="85%" style={{ marginBottom: 6 }} />
      <SkeletonBox height={12} width="40%" style={{ marginBottom: 10 }} />
      <SkeletonBox height={38} style={{ borderRadius: BorderRadius.pill }} />
    </View>
  );
}

export function SkeletonListItem() {
  return (
    <View style={styles.listItem}>
      <SkeletonBox width={56} height={56} style={{ borderRadius: BorderRadius.md, marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <SkeletonBox height={14} width="60%" style={{ marginBottom: 6 }} />
        <SkeletonBox height={12} width="90%" style={{ marginBottom: 4 }} />
        <SkeletonBox height={12} width="40%" />
      </View>
    </View>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.gridItem}>
          <SkeletonProductCard />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    flex: 1,
    ...Shadow.card,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...Shadow.card,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: Spacing.screen,
  },
  gridItem: { width: '47%' },
});
