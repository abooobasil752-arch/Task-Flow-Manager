import { useMemo } from "react";
import { Layout } from "../components/Layout";
import { useTasks } from "../hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";
import { format, subDays, isPast, startOfDay, isToday, parseISO } from "date-fns";
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";

export default function Stats() {
  const { tasks, categories } = useTasks();
  const { theme } = useTheme();
  
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const overdue = tasks.filter(t => {
      if (t.status === "done" || !t.dueDate) return false;
      const date = parseISO(t.dueDate);
      return isPast(startOfDay(date)) && !isToday(date);
    }).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const count = tasks.filter(t => t.categoryId === cat.id).length;
      return { name: cat.name, value: count, color: cat.color };
    }).filter(d => d.value > 0);
  }, [tasks, categories]);

  const priorityData = useMemo(() => {
    const priorities = [
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#3b82f6' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f97316' },
      { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#ef4444' },
    ];
    return priorities.filter(p => p.value > 0);
  }, [tasks]);

  const completionData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM d');
      
      const completedOnDate = tasks.filter(t => {
        if (!t.completedAt) return false;
        const compDate = parseISO(t.completedAt);
        return format(compDate, 'MMM d') === dateStr;
      }).length;
      
      data.push({ date: dateStr, completed: completedOnDate });
    }
    return data;
  }, [tasks]);

  return (
    <Layout>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
            <p className="text-muted-foreground mt-1">Track your productivity and task distribution.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tasks by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tasks by Priority</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {priorityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={gridColor} />
                      <XAxis type="number" tick={{ fill: textColor }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: textColor }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Completed Tasks (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" tick={{ fill: textColor }} />
                    <YAxis allowDecimals={false} tick={{ fill: textColor }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    />
                    <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
