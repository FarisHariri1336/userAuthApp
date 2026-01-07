import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type ErrorTextProps = {
  message?: string;
};

/**
 * Reusable error text component
 * Only renders if message is provided
 */
export function ErrorText({ message }: ErrorTextProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.errorLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
});
