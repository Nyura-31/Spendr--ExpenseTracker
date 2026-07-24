import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { Expense } from "../types/Expense";
import { formatCurrency } from "../utils/currency";

interface CategorySpend {
  category: string;
  amount: number;
}

interface ExpenseSummary {
  totalAmount: number;
  highestExpense: Expense;
  lowestExpense: Expense;
  averageAmount: number;
  categorySpending: CategorySpend[];
}

export default function StatisticsScreen() {
  const { expenses } = useExpenses();
  const summary = useMemo<ExpenseSummary | null>(() => {
    if (expenses.length === 0) {
      return null;
    }

    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    const categoryTotals = expenses.reduce<Record<string, number>>((totals, expense) => {
      totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
      return totals;
    }, {});

    return {
      totalAmount,
      highestExpense: expenses.reduce((highest, expense) => expense.amount > highest.amount ? expense : highest),
      lowestExpense: expenses.reduce((lowest, expense) => expense.amount < lowest.amount ? expense : lowest),
      averageAmount: totalAmount / expenses.length,
      categorySpending: Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((first, second) => second.amount - first.amount),
    };
  }, [expenses]);

  if (!summary) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No spending data yet</Text>
          <Text style={styles.emptyText}>Add an expense to see a clear breakdown of your spending.</Text>
        </View>
      </View>
    );
  }

  const largestCategoryAmount = summary.categorySpending[0]?.amount ?? 0;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text style={styles.title}>Spending overview</Text>
      <Text style={styles.subtitle}>A snapshot of all {expenses.length} recorded expenses.</Text>

      <View style={styles.primaryCard}>
        <Text style={styles.primaryLabel}>TOTAL AMOUNT SPENT</Text>
        <Text style={styles.primaryAmount}>{formatCurrency(summary.totalAmount)}</Text>
      </View>

      <View style={styles.grid}>
        <StatCard label="Total expenses" value={String(expenses.length)} />
        <StatCard label="Average expense" value={formatCurrency(summary.averageAmount)} />
        <StatCard label="Highest expense" value={formatCurrency(summary.highestExpense.amount)} detail={summary.highestExpense.title} />
        <StatCard label="Lowest expense" value={formatCurrency(summary.lowestExpense.amount)} detail={summary.lowestExpense.title} />
      </View>

      <Text style={styles.sectionTitle}>Spending by category</Text>
      <View style={styles.categoryCard}>
        {summary.categorySpending.map((category) => {
          const percentage = largestCategoryAmount > 0 ? (category.amount / largestCategoryAmount) * 100 : 0;

          return (
            <View key={category.category} style={styles.categoryRow}>
              <View style={styles.categoryHeading}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(category.amount)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.bar, { width: `${Math.max(percentage, 4)}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
      <Text numberOfLines={1} style={styles.statValue}>{value}</Text>
      {detail ? <Text numberOfLines={1} style={styles.statDetail}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#F8FAFC", flex: 1 }, content: { padding: 20, paddingBottom: 36 },
  title: { color: "#0F172A", fontSize: 25, fontWeight: "800" }, subtitle: { color: "#64748B", fontSize: 14, lineHeight: 21, marginTop: 6 },
  primaryCard: { backgroundColor: "#4F46E5", borderRadius: 22, marginTop: 24, padding: 22 }, primaryLabel: { color: "#C7D2FE", fontSize: 12, fontWeight: "800", letterSpacing: 0.7 }, primaryAmount: { color: "#FFFFFF", fontSize: 32, fontWeight: "800", marginTop: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 }, statCard: { backgroundColor: "#FFFFFF", borderRadius: 16, flexGrow: 1, flexBasis: "46%", minWidth: 145, padding: 15 }, statLabel: { color: "#64748B", fontSize: 10, fontWeight: "800", letterSpacing: 0.45 }, statValue: { color: "#0F172A", fontSize: 18, fontWeight: "800", marginTop: 8 }, statDetail: { color: "#64748B", fontSize: 12, marginTop: 5 },
  sectionTitle: { color: "#0F172A", fontSize: 18, fontWeight: "800", marginBottom: 12, marginTop: 26 }, categoryCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16 }, categoryRow: { marginBottom: 17 }, categoryHeading: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }, categoryName: { color: "#334155", fontSize: 14, fontWeight: "700" }, categoryAmount: { color: "#0F172A", fontSize: 14, fontWeight: "800" }, track: { backgroundColor: "#E2E8F0", borderRadius: 99, height: 8, overflow: "hidden" }, bar: { backgroundColor: "#6366F1", borderRadius: 99, height: "100%" },
  emptyContainer: { alignItems: "center", backgroundColor: "#F8FAFC", flex: 1, justifyContent: "center", padding: 20 }, emptyCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 18, maxWidth: 420, padding: 28 }, emptyTitle: { color: "#0F172A", fontSize: 19, fontWeight: "800" }, emptyText: { color: "#64748B", fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: "center" },
});
