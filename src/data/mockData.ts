import { Expense, Receipt } from "@/types/finance";

export const sampleExpenses: Expense[] = [
  {
    id: 1,
    description: "Grocery shopping",
    category: "Food",
    amount: 127.50,
    date: "2024-01-15",
    type: "expense"
  },
  {
    id: 2,
    description: "Monthly salary",
    category: "Income",
    amount: 4500.00,
    date: "2024-01-01",
    type: "income"
  },
  {
    id: 3,
    description: "Coffee & pastry",
    category: "Food",
    amount: 12.75,
    date: "2024-01-14",
    type: "expense"
  },
  {
    id: 4,
    description: "Gas station fill-up",
    category: "Travel",
    amount: 45.20,
    date: "2024-01-13",
    type: "expense"
  },
  {
    id: 5,
    description: "Netflix subscription",
    category: "Entertainment",
    amount: 15.99,
    date: "2024-01-12",
    type: "expense"
  },
  {
    id: 6,
    description: "Pharmacy visit",
    category: "Health",
    amount: 28.50,
    date: "2024-01-11",
    type: "expense"
  },
  {
    id: 7,
    description: "New shoes",
    category: "Shopping",
    amount: 89.99,
    date: "2024-01-10",
    type: "expense"
  },
  {
    id: 8,
    description: "Electricity bill",
    category: "Bills",
    amount: 156.78,
    date: "2024-01-09",
    type: "expense"
  }
];

export const sampleReceipts: Receipt[] = [
  {
    id: 1,
    name: "Starbucks Coffee",
    amount: 5.45,
    category: "Food",
    date: "2024-01-15",
    image: "/api/placeholder/300/400"
  },
  {
    id: 2,
    name: "Target Shopping",
    amount: 67.32,
    category: "Shopping", 
    date: "2024-01-14",
    image: "/api/placeholder/300/400"
  },
  {
    id: 3,
    name: "Shell Gas Station",
    amount: 38.90,
    category: "Travel",
    date: "2024-01-13",
    image: "/api/placeholder/300/400"
  },
  {
    id: 4,
    name: "CVS Pharmacy",
    amount: 24.67,
    category: "Health",
    date: "2024-01-12",
    image: "/api/placeholder/300/400"
  },
  {
    id: 5,
    name: "McDonald's",
    amount: 11.25,
    category: "Food",
    date: "2024-01-11",
    image: "/api/placeholder/300/400"
  },
  {
    id: 6,
    name: "Uber Ride",
    amount: 18.50,
    category: "Travel",
    date: "2024-01-10",
    image: "/api/placeholder/300/400"
  }
];