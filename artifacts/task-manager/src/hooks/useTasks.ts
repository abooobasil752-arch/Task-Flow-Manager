import { useState, useEffect, useCallback, useMemo } from "react";
import { Task, Category } from "../lib/types";
import { loadTasks, saveTasks, loadCategories, saveCategories } from "../lib/storage";

export function useTasks() {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [categories, setCategoriesState] = useState<Category[]>([]);
  
  useEffect(() => {
    setTasksState(loadTasks());
    setCategoriesState(loadCategories());
  }, []);

  const setTasks = useCallback((newTasks: Task[]) => {
    setTasksState(newTasks);
    saveTasks(newTasks);
  }, []);

  const setCategories = useCallback((newCategories: Category[]) => {
    setCategoriesState(newCategories);
    saveCategories(newCategories);
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [...prev, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter(t => t.id !== id));
  }, [setTasks]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) => prev.map(t => {
      if (t.id === id) {
        const isDone = t.status === "done";
        return {
          ...t,
          status: isDone ? "todo" : "done",
          completedAt: isDone ? undefined : new Date().toISOString()
        };
      }
      return t;
    }));
  }, [setTasks]);

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    setCategories((prev) => [...prev, newCategory]);
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter(c => c.id !== id));
    // Also update tasks that had this category to some default? Or just leave it as broken ref, handled by UI
  }, [setCategories]);

  return {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addCategory,
    deleteCategory
  };
}
