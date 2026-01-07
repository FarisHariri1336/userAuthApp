import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Navigation type definitions
 * Defines param lists for all navigation stacks
 */

/**
 * Auth stack param list (non-authenticated screens)
 */
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

/**
 * App stack param list (authenticated screens)
 */
export type AppStackParamList = {
  Home: undefined;
};

/**
 * Root navigation param list
 * Combines all stacks for type-safe navigation
 */
export type RootStackParamList = AuthStackParamList & AppStackParamList;

/**
 * Screen props types for type-safe navigation
 */
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;
export type HomeScreenProps = NativeStackScreenProps<AppStackParamList, 'Home'>;
