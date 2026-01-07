import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../features/auth/AuthContext";
import { AuthError, AUTH_ERROR_MESSAGES } from "../features/auth/errors";
import { isValidEmail, required } from "../features/auth/validators";
import { Screen } from "../shared/components/Screen";
import { TextField } from "../shared/components/TextField";
import { PrimaryButton } from "../shared/components/PrimaryButton";
import { ErrorText } from "../shared/components/ErrorText";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";
import { LoginScreenProps } from "../navigation/types";

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setError("");

    // Validate email
    if (!required(email)) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    // Validate password
    if (!required(password)) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
    } catch (err) {
      if (err instanceof AuthError) {
        setError(AUTH_ERROR_MESSAGES[err.code]);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        <View style={styles.form}>
          <ErrorText message={error} />

          <TextField
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            error={emailError}
          />

          <TextField
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            placeholder="Enter your password"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            error={passwordError}
            showPasswordToggle
          />

          <PrimaryButton
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  form: {
    marginBottom: spacing.xl,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  signupLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "700",
  },
});
