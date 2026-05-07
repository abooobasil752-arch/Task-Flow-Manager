import { Category } from "../lib/types";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FilterState {
  search: string;
  category: string;
  priority: string;
  status: string;
  sortBy: "dueDate" | "priority" | "createdAt";
  sortOrder: "asc" | "desc";
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories: Category[];
}

export function FilterBar({ filters, onChange, categories }: FilterBarProps) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleSort = (newSortBy: "dueDate" | "priority" | "createdAt") => {
    if (filters.sortBy === newSortBy) {
      update("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      onChange({ ...filters, sortBy: newSortBy, sortOrder: "asc" });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 bg-card p-3 rounded-xl border border-border">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-9 bg-background"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
        <Select value={filters.status} onValueChange={(v) => update("status", v)}>
          <SelectTrigger className="w-[130px] bg-background">
            <Filter className="w-3 h-3 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.priority} onValueChange={(v) => update("priority", v)}>
          <SelectTrigger className="w-[130px] bg-background">
            <Filter className="w-3 h-3 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.category} onValueChange={(v) => update("category", v)}>
          <SelectTrigger className="w-[140px] bg-background">
            <Filter className="w-3 h-3 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(v) => {
          const [by, order] = v.split("-");
          onChange({ ...filters, sortBy: by as any, sortOrder: order as any });
        }}>
          <SelectTrigger className="w-[150px] bg-background">
            <ArrowUpDown className="w-3 h-3 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate-asc">Due Date (Earliest)</SelectItem>
            <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
            <SelectItem value="priority-desc">Priority (Highest)</SelectItem>
            <SelectItem value="priority-asc">Priority (Lowest)</SelectItem>
            <SelectItem value="createdAt-desc">Created (Newest)</SelectItem>
            <SelectItem value="createdAt-asc">Created (Oldest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
