import { Link, useLocation } from "wouter";
import { LayoutDashboard, CheckSquare, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background transition-colors duration-300">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card p-6 flex flex-col gap-8 flex-shrink-0">
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <CheckSquare size={18} strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-lg tracking-tight">Focus</span>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="btn-theme-toggle-mobile"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors whitespace-nowrap md:whitespace-normal text-sm font-medium ${
              location === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            data-testid="nav-home"
          >
            <CheckSquare size={18} />
            <span>Tasks</span>
          </Link>
          <Link
            href="/stats"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors whitespace-nowrap md:whitespace-normal text-sm font-medium ${
              location === "/stats"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            data-testid="nav-stats"
          >
            <LayoutDashboard size={18} />
            <span>Statistics</span>
          </Link>
        </nav>

        <div className="hidden md:flex mt-auto">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="btn-theme-toggle"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-[calc(100dvh-73px)] md:h-[100dvh] overflow-hidden">
        {children}
      </main>
    </div>
  );
}
