import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../features/auth/AuthContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { colors } from '../shared/theme/colors';

/**
 * Root navigator with auth gating
 * Shows AuthStack if user is not authenticated, otherwise shows AppStack
 * Displays loading indicator during bootstrap
 */
export function RootNavigator() {
  const { user, isBootstrapping } = useAuth();

  // Show loading screen during bootstrap
  if (isBootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
