export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in-progress" | "done";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  priority: Priority;
  status: Status;
  dueDate?: string; // ISO string
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}
