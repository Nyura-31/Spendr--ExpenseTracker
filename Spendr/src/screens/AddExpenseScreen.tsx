import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { ExpenseForm } from "../components/expense/ExpenseForm";
import { useExpenses } from "../context/ExpenseContext";
import { ExpenseInput } from "../types/Expense";

export default function AddExpenseScreen() {
  const navigation = useNavigation<any>();
  const { addExpense } = useExpenses();

  const handleSubmit = (expense: ExpenseInput) => {
    addExpense(expense);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <ExpenseForm submitLabel="Add expense" onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
});
