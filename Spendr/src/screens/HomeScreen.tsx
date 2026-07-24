import { useState } from "react";
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ExpenseCard } from "../components/expense/ExpenseCard";
import { useExpenses } from "../context/ExpenseContext";
import EditExpenseScreen from "./EditExpenseScreen";
import { Expense } from "../types/Expense";
import { formatCurrency } from "../utils/currency";

export default function HomeScreen() {
  const { expenses, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
  };

  const confirmDelete = (expense: Expense) => {
    if (Platform.OS === "web") {
      if (window.confirm(`Remove "${expense.title}" from your expenses?`)) {
        void handleDelete(expense.id);
      }

      return;
    }

  handleDelete(expense.id);
};

//   const confirmDelete = (expense: Expense) => {
//     Alert.alert("Delete expense?", `Remove “${expense.title}” from your expenses?`, [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => void handleDelete(expense.id) },
//     ]);
//   };


  if (editingExpense) {
    return <EditExpenseScreen expense={editingExpense} onDone={() => setEditingExpense(null)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View><Text style={styles.summaryLabel}>TOTAL SPENT</Text><Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text></View>
        <View style={styles.countBadge}><Text style={styles.count}>{expenses.length}</Text><Text style={styles.countLabel}>expenses</Text></View>
      </View>
      <Text style={styles.sectionTitle}>Recent expenses</Text>
      <FlatList
        data={expenses}
        extraData={expenses}
        keyExtractor={(expense) => expense.id}
        renderItem={({ item }) => <ExpenseCard expense={item} onEdit={setEditingExpense} onDelete={confirmDelete} />}
        contentContainerStyle={expenses.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyTitle}>No expenses yet</Text><Text style={styles.emptyText}>Use the Add tab to record your first expense.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  summary: { backgroundColor: "#4F46E5", borderRadius: 22, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { color: "#C7D2FE", fontSize: 12, fontWeight: "800", letterSpacing: 0.8 }, totalAmount: { color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 5 },
  countBadge: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 }, count: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" }, countLabel: { color: "#E0E7FF", fontSize: 11, marginTop: 2 },
  sectionTitle: { color: "#0F172A", fontSize: 18, fontWeight: "800", marginTop: 24, marginBottom: 12 }, list: { paddingBottom: 18 }, emptyList: { flexGrow: 1, justifyContent: "center", paddingBottom: 100 },
  emptyState: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, padding: 28 }, emptyTitle: { color: "#0F172A", fontSize: 18, fontWeight: "800" }, emptyText: { color: "#64748B", fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: "center" },
});
