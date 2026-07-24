import { StyleSheet, View } from "react-native";
import { ExpenseForm } from "../components/expense/ExpenseForm";
import { useExpenses } from "../context/ExpenseContext";
import { Expense, ExpenseInput } from "../types/Expense";

interface EditExpenseScreenProps {
  expense: Expense;
  onDone: () => void;
}

export default function EditExpenseScreen({ expense, onDone }: EditExpenseScreenProps) {
  const { editExpense } = useExpenses();

  const handleSubmit = (updates: ExpenseInput) => {
    editExpense(expense.id, updates);
    onDone();
  };

  return (
    <View style={styles.container}>
      <ExpenseForm
        initialValues={expense}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={onDone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
});
