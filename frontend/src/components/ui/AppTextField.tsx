import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography, BorderRadius, Spacing } from '../../constants/spacing';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secureToggle?: boolean;
  testID?: string;
}

export default function AppTextField({ label, error, icon, secureToggle, secureTextEntry, style, testID, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry ?? false);
  const hasError = Boolean(error);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.container, focused && styles.focused, hasError ? styles.errorBorder : null]}>
        {icon && <Ionicons name={icon} size={18} color={focused ? Colors.primary : Colors.textTertiary} style={styles.icon} />}
        <TextInput
          testID={testID}
          style={[styles.input, style]}
          placeholderTextColor={Colors.textPlaceholder}
          secureTextEntry={secure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secureToggle && (
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
            <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: { ...Typography.label, color: Colors.textSecondary, marginBottom: Spacing.xs },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
  },
  focused: { borderColor: Colors.primaryDark, backgroundColor: Colors.surfaceAlt },
  errorBorder: { borderColor: Colors.error },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  eyeBtn: { padding: Spacing.xs, marginLeft: Spacing.xs },
  error: { ...Typography.caption, color: Colors.error, marginTop: Spacing.xs },
});
