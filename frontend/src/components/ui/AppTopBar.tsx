import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing, Typography } from '../../constants/spacing';

interface AppTopBarProps {
  title: string;
  subtitle?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  style?: ViewStyle;
}

export default function AppTopBar({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  style,
}: AppTopBarProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>
        {leftIcon && onLeftPress ? (
          <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
            <Ionicons name={leftIcon} size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.side}>
        {rightIcon && onRightPress ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <Ionicons name={rightIcon} size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  side: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
