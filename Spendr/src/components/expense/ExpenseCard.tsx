import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Expense } from "../../types/Expense";
import { formatCurrency } from "../../utils/currency";

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(`${date}T00:00:00`),
  );

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={styles.title}>{expense.title}</Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.categoryPill}><Text style={styles.category}>{expense.category}</Text></View>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={() => onEdit(expense)} style={styles.editButton}>
          <Ionicons color="#4F46E5" name="pencil-outline" size={15} /><Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => onDelete(expense)} style={styles.deleteButton}>
          <Ionicons color="#DC2626" name="trash-outline" size={15} /><Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: "#0F172A", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  content: { gap: 12 }, topRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  title: { color: "#0F172A", fontSize: 16, fontWeight: "700", flex: 1 }, amount: { color: "#4F46E5", fontSize: 17, fontWeight: "800" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, categoryPill: { backgroundColor: "#EEF2FF", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  category: { color: "#4338CA", fontSize: 12, fontWeight: "700" }, date: { color: "#64748B", fontSize: 13 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 }, editButton: { alignItems: "center", backgroundColor: "#EEF2FF", borderRadius: 9, flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 7 }, deleteButton: { alignItems: "center", backgroundColor: "#FEF2F2", borderRadius: 9, flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 7 },
  editText: { color: "#4F46E5", fontSize: 13, fontWeight: "700" }, deleteText: { color: "#DC2626", fontSize: 13, fontWeight: "700" },
});
