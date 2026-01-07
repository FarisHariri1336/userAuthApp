import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TouchableOpacity, TextInputProps, Image } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { icons, iconSizes } from '../theme/icons';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
};

/**
 * Reusable text input component with label, error display, and optional password toggle
 */
export function TextField({ label, error, showPasswordToggle, ...textInputProps }: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = textInputProps.secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        <TextInput
          {...textInputProps}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={[
            styles.input,
            textInputProps.style,
          ]}
          placeholderTextColor={colors.inputPlaceholder}
          accessible={true}
          accessibilityLabel={label}
          accessibilityHint={textInputProps.placeholder}
          accessibilityState={{ disabled: textInputProps.editable === false }}
        />
        {showPasswordToggle && textInputProps.secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            accessibilityHint="Toggle password visibility"
          >
            <Image
              source={isPasswordVisible ? icons.eyeOpen : icons.eyeClosed}
              style={styles.toggleIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: colors.inputBackground,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundLight,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  input: {
    height: 56,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.inputText,
    fontWeight: '500',
  },
  toggleButton: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  toggleIcon: {
    width: iconSizes.medium,
    height: iconSizes.medium,
    tintColor: colors.textLight,
  },
  errorContainer: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '500',
  },
});
