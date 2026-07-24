import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    setIsLoggingOut(true);

    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Unable to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.email}>{user?.email ?? "Signed-in user"}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable accessibilityRole="button" disabled={isLoggingOut} onPress={() => void handleLogout()} style={[styles.logoutButton, isLoggingOut && styles.disabledButton]}>
          {isLoggingOut ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.logoutText}>Log out</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: "#F8FAFC", flex: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, maxWidth: 420, padding: 24, width: "100%" },
  title: { color: "#0F172A", fontSize: 24, fontWeight: "800" }, email: { color: "#64748B", fontSize: 15, marginTop: 8 },
  error: { color: "#DC2626", fontSize: 13, marginTop: 18 }, logoutButton: { alignItems: "center", backgroundColor: "#DC2626", borderRadius: 12, justifyContent: "center", marginTop: 24, minHeight: 48 }, disabledButton: { opacity: 0.65 }, logoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
