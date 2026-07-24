import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import { formatCurrency } from "../utils/currency";

const getInitials = (email: string) => {
  const name = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = name.split(/\s+/).filter(Boolean);

  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2)).toUpperCase() || "SP";
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { expenses } = useExpenses();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const email = user?.email ?? "Signed-in user";
  const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
  const memberSince = user?.metadata.creationTime
    ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(user.metadata.creationTime))
    : new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date());

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
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.page}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{getInitials(email)}</Text></View>
          <Text style={styles.welcome}>Welcome back</Text>
          <Text numberOfLines={1} style={styles.email}>{email}</Text>
        </View>

        <Text style={styles.sectionTitle}>Your account</Text>
        <View style={styles.statsGrid}>
          <AccountCard icon="receipt-outline" label="Total expenses" value={String(expenses.length)} />
          <AccountCard icon="wallet-outline" label="Total spent" value={formatCurrency(totalSpent)} />
          <AccountCard icon="calendar-outline" label="Member since" value={memberSince} fullWidth />
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <SettingRow icon="moon-outline" label="Dark Mode" comingSoon />
          <View style={styles.divider} />
          <SettingRow icon="notifications-outline" label="Notifications" comingSoon />
          <View style={styles.divider} />
          <SettingRow icon="help-circle-outline" label="Help & Support" />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={isLoggingOut}
          onPress={() => void handleLogout()}
          style={({ pressed }) => [styles.logoutButton, (pressed || isLoggingOut) && styles.buttonMuted]}
        >
          {isLoggingOut ? <ActivityIndicator color="#FFFFFF" /> : <><Ionicons color="#FFFFFF" name="log-out-outline" size={20} /><Text style={styles.logoutText}>Log out</Text></>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

function AccountCard({ icon, label, value, fullWidth = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; fullWidth?: boolean }) {
  return <View style={[styles.accountCard, fullWidth && styles.fullWidthCard]}><View style={styles.cardIcon}><Ionicons color="#4F46E5" name={icon} size={19} /></View><Text style={styles.cardLabel}>{label.toUpperCase()}</Text><Text numberOfLines={1} style={styles.cardValue}>{value}</Text></View>;
}

function SettingRow({ icon, label, comingSoon = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; comingSoon?: boolean }) {
  return <View style={styles.settingRow}><View style={styles.settingIcon}><Ionicons color="#4F46E5" name={icon} size={20} /></View><Text style={styles.settingLabel}>{label}</Text>{comingSoon ? <View style={styles.soonBadge}><Text style={styles.soonText}>COMING SOON</Text></View> : <Ionicons color="#94A3B8" name="chevron-forward" size={19} />}</View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F8FAFC", flex: 1 }, content: { alignItems: "center", padding: 20, paddingBottom: 36 }, page: { maxWidth: 560, width: "100%" },
  profileHeader: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 24, padding: 28, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 3 }, avatar: { alignItems: "center", backgroundColor: "#4F46E5", borderColor: "#E0E7FF", borderRadius: 44, borderWidth: 5, height: 88, justifyContent: "center", width: 88 }, avatarText: { color: "#FFFFFF", fontSize: 27, fontWeight: "800", letterSpacing: 0.5 }, welcome: { color: "#0F172A", fontSize: 22, fontWeight: "800", marginTop: 15 }, email: { color: "#64748B", fontSize: 14, marginTop: 6, maxWidth: "100%" },
  sectionTitle: { color: "#0F172A", fontSize: 17, fontWeight: "800", marginBottom: 12, marginTop: 28 }, statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 }, accountCard: { backgroundColor: "#FFFFFF", borderRadius: 18, flexGrow: 1, flexBasis: "46%", minWidth: 150, padding: 16, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }, fullWidthCard: { flexBasis: "100%" }, cardIcon: { alignItems: "center", backgroundColor: "#EEF2FF", borderRadius: 10, height: 36, justifyContent: "center", width: 36 }, cardLabel: { color: "#64748B", fontSize: 10, fontWeight: "800", letterSpacing: 0.55, marginTop: 14 }, cardValue: { color: "#0F172A", fontSize: 18, fontWeight: "800", marginTop: 6 },
  settingsCard: { backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 16, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }, settingRow: { alignItems: "center", flexDirection: "row", minHeight: 66 }, settingIcon: { alignItems: "center", backgroundColor: "#EEF2FF", borderRadius: 10, height: 38, justifyContent: "center", marginRight: 12, width: 38 }, settingLabel: { color: "#1E293B", flex: 1, fontSize: 15, fontWeight: "700" }, soonBadge: { backgroundColor: "#F1F5F9", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 5 }, soonText: { color: "#64748B", fontSize: 9, fontWeight: "800", letterSpacing: 0.4 }, divider: { backgroundColor: "#E2E8F0", height: StyleSheet.hairlineWidth, marginLeft: 50 },
  error: { color: "#B91C1C", fontSize: 13, lineHeight: 19, marginTop: 18, textAlign: "center" }, logoutButton: { alignItems: "center", backgroundColor: "#DC2626", borderRadius: 14, flexDirection: "row", gap: 9, justifyContent: "center", marginTop: 22, minHeight: 52, shadowColor: "#991B1B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 3 }, buttonMuted: { opacity: 0.68 }, logoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
