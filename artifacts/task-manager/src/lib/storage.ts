import { Task, Category } from "./types";

const TASKS_KEY = "task-manager-tasks";
const CATEGORIES_KEY = "task-manager-categories";

const SEED_CATEGORIES: Category[] = [
  { id: "c1", name: "Work", color: "#3b82f6" },
  { id: "c2", name: "Personal", color: "#10b981" },
  { id: "c3", name: "Health", color: "#f43f5e" },
  { id: "c4", name: "Finance", color: "#eab308" },
];

const SEED_TASKS: Task[] = [
  {
    id: crypto.randomUUID(),
    title: "Finish Q3 Report",
    description: "Compile the financials for Q3 and send to the board.",
    categoryId: "c1",
    priority: "high",
    status: "in-progress",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Grocery Shopping",
    description: "Milk, eggs, bread, and coffee beans.",
    categoryId: "c2",
    priority: "medium",
    status: "todo",
    dueDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Dentist Appointment",
    description: "Annual checkup",
    categoryId: "c3",
    priority: "low",
    status: "done",
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Pay Rent",
    categoryId: "c4",
    priority: "urgent",
    status: "todo",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Morning Run",
    description: "5k run around the park.",
    categoryId: "c3",
    priority: "medium",
    status: "done",
    dueDate: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Read Chapter 4",
    categoryId: "c2",
    priority: "low",
    status: "todo",
    createdAt: new Date().toISOString(),
  }
];

const safeParseJSON = <T>(stored: string | null, fallback: T): T => {
  if (!stored || stored === "undefined" || stored.trim() === "") return fallback;
  try {
    const parsed = JSON.parse(stored);
    if (parsed === null || parsed === undefined || !Array.isArray(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
};

export const loadCategories = (): Category[] => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  const result = safeParseJSON<Category[]>(stored, []);
  if (result.length === 0) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
    return SEED_CATEGORIES;
  }
  return result;
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const loadTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  const result = safeParseJSON<Task[]>(stored, []);
  if (result.length === 0 && !stored) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
    return SEED_TASKS;
  }
  if (result.length === 0 && stored !== null) {
    localStorage.removeItem(TASKS_KEY);
    localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
    return SEED_TASKS;
  }
  return result;
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};
