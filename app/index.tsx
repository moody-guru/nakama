import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { signInUser, signUpUser } from "../src/services/auth";
import { theme } from "../src/styles/theme";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        if (!name) {
          Alert.alert("Error", "Name required for the bounty board!");
          setLoading(false);
          return;
        }
        await signUpUser(email, password, name);
      } else {
        await signInUser(email, password);
      }
    } catch (error: any) {
      Alert.alert("Auth Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. MAIN WRAPPER: Handles the Background Color & Notch
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* 2. KEYBOARD AVOIDING VIEW: Pushes content up */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 3. SCROLL VIEW: Allows scrolling if screen is too small */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>NAKAMA</Text>
            <Text style={styles.subtitle}>The Otaku Marketplace</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>
              {isSignup ? "INITIATE SEQUENCE" : "WELCOME BACK"}
            </Text>

            {isSignup && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>CODENAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. StrawHat"
                  placeholderTextColor={theme.colors.textDim}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>EMAIL LINK</Text>
              <TextInput
                style={styles.input}
                placeholder="user@nakama.net"
                placeholderTextColor={theme.colors.textDim}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PASSCODE</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={theme.colors.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0F0F1A" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignup ? "ESTABLISH CONNECTION" : "ACCESS SYSTEM"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsSignup(!isSignup)}
              style={styles.switchBtn}
            >
              <Text style={styles.switchText}>
                {isSignup ? "Already have an ID? Login" : "New here? Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    color: theme.colors.primary,
    letterSpacing: 4,
    textShadowColor: theme.colors.primary,
    textShadowRadius: 10,
  },
  subtitle: {
    color: theme.colors.secondary,
    fontSize: 16,
    letterSpacing: 2,
    marginTop: 5,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: { marginBottom: 16 },
  label: {
    color: theme.colors.textDim,
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#0F0F1A",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#0F0F1A",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
  switchBtn: {
    marginTop: 24,
    alignItems: "center",
  },
  switchText: {
    color: theme.colors.secondary,
    fontWeight: "600",
  },
});
