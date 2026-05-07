import { Task, Category } from "../lib/types";
import { format, isPast, isToday, isTomorrow, parseISO, startOfDay } from "date-fns";
import { Check, Clock, AlertCircle, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  category?: Category;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};

export function TaskCard({ task, category, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const isDone = task.status === "done";
  
  let dueDateStr = "";
  let isOverdue = false;
  if (task.dueDate) {
    const date = parseISO(task.dueDate);
    if (isToday(date)) dueDateStr = "Today";
    else if (isTomorrow(date)) dueDateStr = "Tomorrow";
    else dueDateStr = format(date, "MMM d");
    
    if (isPast(startOfDay(date)) && !isToday(date) && !isDone) {
      isOverdue = true;
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative p-4 rounded-xl border ${isDone ? "bg-muted/50 border-transparent" : "bg-card border-border shadow-sm"} transition-all duration-200`}
      data-testid={`card-task-${task.id}`}
    >
      <div className="flex gap-4 items-start">
        <div className="pt-1">
          <Checkbox 
            checked={isDone}
            onCheckedChange={() => onToggleComplete(task.id)}
            data-testid={`checkbox-task-${task.id}`}
            className={`w-6 h-6 rounded-full transition-all ${isDone ? "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary" : "border-muted-foreground"}`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium truncate transition-colors ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(task)} data-testid={`btn-edit-task-${task.id}`}>
                <Edit2 size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(task.id)} data-testid={`btn-delete-task-${task.id}`}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className={`mt-1 text-sm line-clamp-2 ${isDone ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {category && (
              <Badge variant="secondary" className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-normal" style={{ backgroundColor: `${category.color}15`, color: category.color, borderColor: `${category.color}30` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                {category.name}
              </Badge>
            )}
            
            <Badge variant="outline" className={`px-2 py-0.5 text-xs font-normal border-transparent ${priorityColors[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            {dueDateStr && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${isOverdue ? "text-destructive border-destructive/30 bg-destructive/10" : isDone ? "text-muted-foreground border-transparent" : "text-muted-foreground border-border"}`}>
                    {isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                    <span className={isOverdue ? "font-medium" : ""}>{dueDateStr}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Due: {format(parseISO(task.dueDate!), "PPP")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
