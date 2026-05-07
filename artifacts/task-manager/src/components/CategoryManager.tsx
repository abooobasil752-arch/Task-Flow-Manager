import { useState } from "react";
import { Category } from "../lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

interface CategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onAdd: (category: Omit<Category, "id">) => void;
  onDelete: (id: string) => void;
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", 
  "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", 
  "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
];

export function CategoryManager({ open, onOpenChange, categories, onAdd, onDelete }: CategoryManagerProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), color });
    setName("");
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded-md border bg-card">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.color }} />
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(c.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label>Add New Category</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Category name..." 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <Button onClick={handleAdd} size="icon" disabled={!name.trim()}>
                <Plus size={18} />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
