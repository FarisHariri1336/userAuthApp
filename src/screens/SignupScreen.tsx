import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../features/auth/AuthContext";
import { AuthError, AUTH_ERROR_MESSAGES } from "../features/auth/errors";
import {
  isValidEmail,
  isStrongEnoughPassword,
  required,
} from "../features/auth/validators";
import { Screen } from "../shared/components/Screen";
import { TextField } from "../shared/components/TextField";
import { PrimaryButton } from "../shared/components/PrimaryButton";
import { ErrorText } from "../shared/components/ErrorText";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";
import { SignupScreenProps } from "../navigation/types";

export function SignupScreen({ navigation }: SignupScreenProps) {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setError("");

    // Validate name
    if (!required(name)) {
      setNameError("Name is required");
      isValid = false;
    }

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
    } else if (!isStrongEnoughPassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signup({ name, email, password });
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

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <ErrorText message={error} />

          <TextField
            label="Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError("");
            }}
            placeholder="John Cena"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            error={nameError}
          />

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
            placeholder="At least 6 characters"
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            error={passwordError}
            showPasswordToggle
          />

          <PrimaryButton
            title="Sign Up"
            onPress={handleSignup}
            isLoading={isLoading}
            disabled={isLoading}
            style={styles.signupButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Login</Text>
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
  signupButton: {
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
  loginLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "700",
  },
});
