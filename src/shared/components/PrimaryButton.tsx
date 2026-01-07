import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
};

/**
 * Reusable primary button component with loading state and variants
 */
export function PrimaryButton({
  title,
  isLoading,
  disabled,
  variant = 'primary',
  ...touchableProps
}: PrimaryButtonProps) {
  const isDisabled = disabled || isLoading;

  const buttonStyle = variant === 'primary'
    ? styles.buttonPrimary
    : variant === 'secondary'
    ? styles.buttonSecondary
    : styles.buttonOutline;

  const textStyle = variant === 'outline'
    ? styles.buttonTextOutline
    : styles.buttonText;

  return (
    <TouchableOpacity
      {...touchableProps}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        buttonStyle,
        isDisabled && styles.buttonDisabled,
        touchableProps.style
      ]}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: isLoading,
      }}
      accessibilityHint={isLoading ? 'Loading, please wait' : undefined}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.backgroundLight} size="small" />
      ) : (
        <Text style={[textStyle, isDisabled && styles.buttonTextDisabled]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.backgroundLight,
    letterSpacing: 0.5,
  },
  buttonTextOutline: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: colors.textMuted,
  },
});
