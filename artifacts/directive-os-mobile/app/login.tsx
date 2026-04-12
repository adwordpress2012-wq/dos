import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    const result = await login(token.trim());
    setLoading(false);
    if (result.ok) {
      router.replace("/(tabs)");
    } else {
      setError(result.error ?? "Invalid token. Please try again.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.navy }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.inner, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoArea}>
          <View style={[styles.logoIcon, { backgroundColor: colors.teal + "20", borderColor: colors.teal + "40" }]}>
            <Ionicons name="shield-checkmark" size={36} color={colors.teal} />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary, fontFamily: "Inter_700Bold" }]}>Directive OS</Text>
          <Text style={[styles.appSub, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Command Bridge</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary, fontFamily: "Inter_600SemiBold" }]}>Sign in to your agency</Text>
          <Text style={[styles.cardSub, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
            Enter the access token from your Directive OS dashboard under Settings → Mobile Access.
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary, fontFamily: "Inter_500Medium" }]}>Access Token</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.navyLight, borderColor: error ? "#ef4444" : colors.border, color: colors.textPrimary, fontFamily: "Inter_400Regular" }]}
            value={token}
            onChangeText={(v) => { setToken(v); setError(null); }}
            placeholder="Paste your access token here"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            returnKeyType="go"
            onSubmitEditing={handleLogin}
          />

          {error && (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={14} color="#ef4444" />
              <Text style={[styles.errorText, { fontFamily: "Inter_400Regular" }]}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.teal, opacity: (!token.trim() || loading) ? 0.6 : 1 }]}
            onPress={handleLogin}
            disabled={!token.trim() || loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#0a0e1a" size="small" />
              : <Text style={[styles.buttonText, { color: "#0a0e1a", fontFamily: "Inter_700Bold" }]}>Sign In</Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={[styles.helpText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>
          Your access token is found in the Directive OS web dashboard under{"\n"}Settings → Mobile Access
        </Text>

        <View style={styles.footer}>
          <Ionicons name="lock-closed" size={11} color={colors.textSecondary} />
          <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: "Inter_400Regular" }]}>Secured by Directive OS · ABN 87 754 544 171</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { paddingHorizontal: 24, alignItems: "center" },
  logoArea: { alignItems: "center", marginBottom: 40 },
  logoIcon: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1, marginBottom: 16 },
  appName: { fontSize: 28, marginBottom: 4 },
  appSub: { fontSize: 15, letterSpacing: 2, textTransform: "uppercase" },
  card: { width: "100%", borderRadius: 16, padding: 24, borderWidth: 1, marginBottom: 24 },
  cardTitle: { fontSize: 18, marginBottom: 8 },
  cardSub: { fontSize: 13, lineHeight: 20, marginBottom: 24 },
  label: { fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, fontSize: 14, marginBottom: 12 },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  errorText: { color: "#ef4444", fontSize: 13 },
  button: { borderRadius: 10, paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 15 },
  helpText: { fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 32 },
  footer: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerText: { fontSize: 11 },
});
