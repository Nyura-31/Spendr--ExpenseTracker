export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

export type ExpenseInput = Omit<Expense, "id">;
