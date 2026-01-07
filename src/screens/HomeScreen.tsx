import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useAuth } from "../features/auth/AuthContext";
import { Screen } from "../shared/components/Screen";
import { PrimaryButton } from "../shared/components/PrimaryButton";
import { colors } from "../shared/theme/colors";
import { spacing } from "../shared/theme/spacing";

const robotLottie = require("../../assets/lottie/robot.json");

export function HomeScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      // Error handling could be added here if needed
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.topDecoration} />

          <View style={styles.avatarContainer}>
            <LottieView
              source={robotLottie}
              autoPlay
              loop
              style={styles.robotAnimation}
            />
          </View>

          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.nameText}>{user.name}</Text>

          <View style={styles.cardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.cardContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.cardContent}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          isLoading={isLoggingOut}
          disabled={isLoggingOut}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: spacing.md,
  },
  topDecoration: {
    position: "absolute",
    top: -100,
    left: -50,
    right: -50,
    height: 200,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    opacity: 0.05,
  },
  avatarContainer: {
    marginBottom: spacing.xl,
    marginTop: spacing.xxl,
    alignItems: "center",
  },
  robotAnimation: {
    width: 200,
    height: 200,
  },
  welcomeText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  nameText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.xxl,
    letterSpacing: -0.5,
  },
  cardsContainer: {
    width: "100%",
    gap: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardContent: {
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },
});
