import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Expense, ExpenseInput } from "../types/Expense";

interface ExpenseContextValue {
  expenses: Expense[];
  addExpense: (expense: ExpenseInput) => void;
  editExpense: (id: string, updates: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
}

const initialExpenses: Expense[] = [
  { id: "1", title: "Weekly groceries", amount: 84.5, category: "Food", date: "2026-07-22", notes: "Produce and pantry staples" },
  { id: "2", title: "Metro card", amount: 25, category: "Transport", date: "2026-07-20", notes: "Monthly top-up" },
  { id: "3", title: "Music subscription", amount: 10.99, category: "Entertainment", date: "2026-07-18", notes: "" },
  { id: "4", title: "Electricity bill", amount: 62.3, category: "Bills", date: "2026-07-15", notes: "July statement" },
];

const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);

export function ExpenseProvider({ children }: PropsWithChildren) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const addExpense = useCallback((expense: ExpenseInput) => {
    setExpenses((currentExpenses) => [
      { ...expense, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
      ...currentExpenses,
    ]);
  }, []);

  const editExpense = useCallback((id: string, updates: ExpenseInput) => {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) => (expense.id === id ? { ...updates, id } : expense)),
    );
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
  }, []);

  const value = useMemo(
    () => ({ expenses, addExpense, editExpense, deleteExpense }),
    [expenses, addExpense, editExpense, deleteExpense],
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenses(): ExpenseContextValue {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }

  return context;
}
