import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import { AuthProvider } from './src/features/auth/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

/**
 * Main App component
 * Wraps the app with ErrorBoundary and AuthProvider
 * ErrorBoundary catches any unhandled errors and prevents crashes
 * AuthProvider manages auth state globally
 * RootNavigator handles auth gating and navigation
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ErrorBoundary>
  );
}
