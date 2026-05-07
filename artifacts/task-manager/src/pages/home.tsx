import { useState, useMemo } from "react";
import { Layout } from "../components/Layout";
import { useTasks } from "../hooks/useTasks";
import { FilterBar, FilterState } from "../components/FilterBar";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { CategoryManager } from "../components/CategoryManager";
import { Button } from "@/components/ui/button";
import { Plus, Tags } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "../lib/types";

export default function Home() {
  const { tasks, categories, addTask, updateTask, deleteTask, toggleTaskComplete, addCategory, deleteCategory } = useTasks();
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    priority: "all",
    status: "all",
    sortBy: "dueDate",
    sortOrder: "asc"
  });

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (filters.search && !t.title.toLowerCase().includes(filters.search.toLowerCase()) && 
            !t.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.category !== "all" && t.categoryId !== filters.category) return false;
        if (filters.priority !== "all" && t.priority !== filters.priority) return false;
        if (filters.status !== "all" && t.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        switch (filters.sortBy) {
          case "dueDate":
            if (!a.dueDate && !b.dueDate) cmp = 0;
            else if (!a.dueDate) cmp = 1;
            else if (!b.dueDate) cmp = -1;
            else cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            break;
          case "createdAt":
            cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case "priority": {
            const weights = { low: 0, medium: 1, high: 2, urgent: 3 };
            cmp = weights[a.priority] - weights[b.priority];
            break;
          }
        }
        return filters.sortOrder === "asc" ? cmp : -cmp;
      });
  }, [tasks, filters]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
              <p className="text-muted-foreground mt-1">Manage your work and stay productive.</p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setIsCategoryManagerOpen(true)}
                className="flex-1 sm:flex-none"
                data-testid="btn-manage-categories"
              >
                <Tags className="w-4 h-4 mr-2" />
                Categories
              </Button>
              <Button 
                onClick={handleCreateTask}
                className="flex-1 sm:flex-none"
                data-testid="btn-add-task"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          <FilterBar filters={filters} onChange={setFilters} categories={categories} />

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={categories.find(c => c.id === task.categoryId)}
                    onToggleComplete={toggleTaskComplete}
                    onEdit={handleEditTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 px-4 bg-muted/30 rounded-xl border border-dashed border-border"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <CheckSquare size={32} />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {tasks.length === 0 
                      ? "You don't have any tasks yet. Create one to get started!"
                      : "No tasks match your current filters. Try adjusting them to see more results."}
                  </p>
                  {tasks.length > 0 ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({ search: "", category: "all", priority: "all", status: "all", sortBy: "dueDate", sortOrder: "asc" })}
                      data-testid="btn-clear-filters"
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button onClick={handleCreateTask} data-testid="btn-add-first-task">
                      <Plus className="w-4 h-4 mr-2" />
                      Create your first task
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <TaskForm 
        open={isTaskFormOpen} 
        onOpenChange={setIsTaskFormOpen} 
        task={editingTask} 
        categories={categories} 
        onSubmit={handleTaskSubmit} 
      />

      <CategoryManager 
        open={isCategoryManagerOpen} 
        onOpenChange={setIsCategoryManagerOpen} 
        categories={categories} 
        onAdd={addCategory} 
        onDelete={deleteCategory} 
      />
    </Layout>
  );
}

// Icon for empty state
function CheckSquare({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  );
}
