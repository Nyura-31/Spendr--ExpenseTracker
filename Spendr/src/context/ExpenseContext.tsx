import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Expense, ExpenseInput } from "../types/Expense";

interface ExpenseContextValue {
  expenses: Expense[];
  addExpense: (expense: ExpenseInput) => Promise<void>;
  editExpense: (id: string, updates: ExpenseInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const EXPENSES_STORAGE_KEY = "@spendr/expenses";

const initialExpenses: Expense[] = [
  { id: "1", title: "Weekly groceries", amount: 84.5, category: "Food", date: "2026-07-22", notes: "Produce and pantry staples" },
  { id: "2", title: "Metro card", amount: 25, category: "Transport", date: "2026-07-20", notes: "Monthly top-up" },
  { id: "3", title: "Music subscription", amount: 10.99, category: "Entertainment", date: "2026-07-18", notes: "" },
  { id: "4", title: "Electricity bill", amount: 62.3, category: "Bills", date: "2026-07-15", notes: "July statement" },
];

function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== "object") {
    return false;
  }

  const expense = value as Record<string, unknown>;
  return typeof expense.id === "string"
    && typeof expense.title === "string"
    && typeof expense.amount === "number"
    && typeof expense.category === "string"
    && typeof expense.date === "string"
    && typeof expense.notes === "string";
}

function parseExpenses(storedExpenses: string): Expense[] {
  const parsedExpenses: unknown = JSON.parse(storedExpenses);

  if (!Array.isArray(parsedExpenses) || !parsedExpenses.every(isExpense)) {
    throw new Error("Saved expenses have an invalid format.");
  }

  return parsedExpenses;
}

const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);

export function ExpenseProvider({ children }: PropsWithChildren) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const expensesRef = useRef<Expense[]>([]);
  const persistenceQueue = useRef(Promise.resolve());

  const persistExpenses = useCallback(async (nextExpenses: Expense[]) => {
    const saveOperation = persistenceQueue.current.then(async () => {
      try {
        await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(nextExpenses));
      } catch (error) {
        console.warn("Unable to save expenses locally.", error);
      }
    });

    persistenceQueue.current = saveOperation;
    await saveOperation;
  }, []);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
        const loadedExpenses = storedExpenses ? parseExpenses(storedExpenses) : initialExpenses;

        expensesRef.current = loadedExpenses;
        setExpenses(loadedExpenses);

        if (!storedExpenses) {
          await persistExpenses(loadedExpenses);
        }
      } catch (error) {
        console.warn("Unable to load saved expenses. Using starter expenses instead.", error);
        expensesRef.current = initialExpenses;
        setExpenses(initialExpenses);
      }
    };

    void loadExpenses();
  }, [persistExpenses]);

  const updateExpenses = useCallback(async (updater: (currentExpenses: Expense[]) => Expense[]) => {
    const nextExpenses = updater(expensesRef.current);
    expensesRef.current = nextExpenses;
    setExpenses(nextExpenses);
    await persistExpenses(nextExpenses);
  }, [persistExpenses]);

  const addExpense = useCallback(async (expense: ExpenseInput) => {
    await updateExpenses((currentExpenses) => [
      { ...expense, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
      ...currentExpenses,
    ]);
  }, [updateExpenses]);

  const editExpense = useCallback(async (id: string, updates: ExpenseInput) => {
    await updateExpenses((currentExpenses) =>
      currentExpenses.map((expense) => (expense.id === id ? { ...updates, id } : expense)),
    );
  }, [updateExpenses]);

  const deleteExpense = useCallback(async (id: string) => {
    const nextExpenses = expensesRef.current.filter((expense) => expense.id !== id);

    if (nextExpenses.length === expensesRef.current.length) {
      return;
    }

    expensesRef.current = nextExpenses;
    setExpenses(nextExpenses);
    await persistExpenses(nextExpenses);
  }, [persistExpenses]);

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
