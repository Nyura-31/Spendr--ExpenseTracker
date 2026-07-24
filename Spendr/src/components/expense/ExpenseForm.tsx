import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ExpenseInput } from "../../types/Expense";

interface ExpenseFormProps {
  initialValues?: ExpenseInput;
  submitLabel: string;
  onSubmit: (expense: ExpenseInput) => void;
  onCancel?: () => void;
}

type FormValues = { title: string; amount: string; category: string; date: string; notes: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const categories = ["Food", "Transport", "Bills", "Entertainment", "Shopping", "Health", "Other"];
const today = new Date().toISOString().slice(0, 10);

export function ExpenseForm({ initialValues, submitLabel, onSubmit, onCancel }: ExpenseFormProps) {
  const [values, setValues] = useState<FormValues>({ title: initialValues?.title ?? "", amount: initialValues ? String(initialValues.amount) : "", category: initialValues?.category ?? "Food", date: initialValues?.date ?? today, notes: initialValues?.notes ?? "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateValue = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};
    const amount = Number(values.amount);
    const parsedDate = new Date(`${values.date}T00:00:00`);
    if (!values.title.trim()) nextErrors.title = "Enter an expense title.";
    if (!Number.isFinite(amount) || amount <= 0) nextErrors.amount = "Enter an amount greater than zero.";
    if (!values.category) nextErrors.category = "Choose a category.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== values.date) nextErrors.date = "Use a valid YYYY-MM-DD date.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ title: values.title.trim(), amount, category: values.category, date: values.date, notes: values.notes.trim() });
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Field label="Title" error={errors.title}><TextInput value={values.title} onChangeText={(value) => updateValue("title", value)} placeholder="e.g. Dinner with friends" style={styles.input} /></Field>
      <Field label="Amount" error={errors.amount}><TextInput value={values.amount} onChangeText={(value) => updateValue("amount", value)} placeholder="0.00" keyboardType="decimal-pad" style={styles.input} /></Field>
      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>{categories.map((category) => <Pressable key={category} onPress={() => updateValue("category", category)} style={[styles.categoryButton, values.category === category && styles.categoryButtonActive]}><Text style={[styles.categoryText, values.category === category && styles.categoryTextActive]}>{category}</Text></Pressable>)}</View>
      {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}
      <Field label="Date" error={errors.date}><TextInput value={values.date} onChangeText={(value) => updateValue("date", value)} placeholder="YYYY-MM-DD" autoCapitalize="none" style={styles.input} /></Field>
      <Field label="Notes (optional)" error={errors.notes}><TextInput value={values.notes} onChangeText={(value) => updateValue("notes", value)} placeholder="Add a note" multiline style={[styles.input, styles.notesInput]} /></Field>
      <Pressable accessibilityRole="button" onPress={handleSubmit} style={styles.submitButton}><Text style={styles.submitText}>{submitLabel}</Text></Pressable>
      {onCancel ? <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancelButton}><Text style={styles.cancelText}>Cancel</Text></Pressable> : null}
    </ScrollView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, gap: 16 }, field: { gap: 8 }, label: { color: "#334155", fontSize: 14, fontWeight: "700" },
  input: { backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderWidth: 1, borderRadius: 12, color: "#0F172A", fontSize: 16, paddingHorizontal: 14, paddingVertical: 13 }, notesInput: { height: 96, textAlignVertical: "top" },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, categoryButton: { borderColor: "#CBD5E1", borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 }, categoryButtonActive: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  categoryText: { color: "#475569", fontSize: 13, fontWeight: "600" }, categoryTextActive: { color: "#FFFFFF" }, error: { color: "#DC2626", fontSize: 12, marginTop: 4 },
  submitButton: { alignItems: "center", backgroundColor: "#4F46E5", borderRadius: 14, marginTop: 8, padding: 16 }, submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" }, cancelButton: { alignItems: "center", padding: 12 }, cancelText: { color: "#64748B", fontSize: 15, fontWeight: "700" },
});

