import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface AppScreenProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  showsVerticalScrollIndicator?: boolean;
}

export default function AppScreen({
  children,
  style,
  scrollable = false,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  ...props
}: AppScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {scrollable ? (
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          {...props}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]} {...props}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
});
