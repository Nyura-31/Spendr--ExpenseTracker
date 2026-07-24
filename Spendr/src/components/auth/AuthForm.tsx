import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (email: string, password: string) => Promise<void>;
  onSwitchMode: () => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthForm({ mode, onSubmit, onSwitchMode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistering = mode === "register";

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(normalizedEmail, password);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.brand}>Spendr</Text>
        <Text style={styles.title}>{isRegistering ? "Create your account" : "Welcome back"}</Text>
        <Text style={styles.subtitle}>{isRegistering ? "Start keeping your expenses organized." : "Sign in to manage your expenses."}</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email address" autoCapitalize="none" autoCorrect={false} keyboardType="email-address" editable={!isSubmitting} style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry editable={!isSubmitting} style={styles.input} />
        {isRegistering ? <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" secureTextEntry editable={!isSubmitting} style={styles.input} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={() => void handleSubmit()} style={[styles.primaryButton, isSubmitting && styles.disabledButton]}>
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>{isRegistering ? "Create account" : "Sign in"}</Text>}
        </Pressable>
        <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={onSwitchMode} style={styles.switchButton}>
          <Text style={styles.switchText}>{isRegistering ? "Already have an account? Sign in" : "New to Spendr? Create an account"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: "#F8FAFC", flex: 1, justifyContent: "center", padding: 24 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 22, maxWidth: 420, padding: 24, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 16, width: "100%", elevation: 4 },
  brand: { color: "#4F46E5", fontSize: 18, fontWeight: "800", marginBottom: 20 }, title: { color: "#0F172A", fontSize: 26, fontWeight: "800" }, subtitle: { color: "#64748B", fontSize: 15, lineHeight: 22, marginBottom: 24, marginTop: 8 },
  input: { backgroundColor: "#F8FAFC", borderColor: "#CBD5E1", borderRadius: 14, borderWidth: 1, color: "#0F172A", fontSize: 16, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 13 },
  error: { color: "#DC2626", fontSize: 13, lineHeight: 19, marginBottom: 12 }, primaryButton: { alignItems: "center", backgroundColor: "#4F46E5", borderRadius: 12, marginTop: 4, minHeight: 50, justifyContent: "center", paddingHorizontal: 16 }, disabledButton: { opacity: 0.65 }, primaryText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  switchButton: { alignItems: "center", marginTop: 18, padding: 8 }, switchText: { color: "#4F46E5", fontSize: 14, fontWeight: "700" },
});
