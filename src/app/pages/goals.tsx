import { useEffect, useState } from "react";
import { Target, TrendingUp, Dumbbell, Briefcase, DollarSign, Book, Plus, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../services/api";

const ICON_MAP: Record<string, any> = {
  Dumbbell,
  Briefcase,
  DollarSign,
  Book,
  Target,
};

export function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalIcon, setNewGoalIcon] = useState("Target");
  const [newGoalColor, setNewGoalColor] = useState("#6366f1");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await api.goals.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setGoals(data);
        } else {
          setGoals([]);
        }
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleAddGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = {
      title: newGoalTitle || "New Objective",
      icon: newGoalIcon || "Target",
      color: newGoalColor || "#6366f1",
      progress: 0,
      milestones: [{ title: "First milestone", completed: false }],
      tasks: ["Initial task"],
    };
    try {
      const data = await api.goals.create(newGoal);
      if (data && (data._id || data.id)) {
        setGoals(prev => [...prev, data]);
        setIsDialogOpen(false);
        setNewGoalTitle("");
        setNewGoalIcon("Target");
        setNewGoalColor("#6366f1");
      }
    } catch (err) {
      console.error("Failed to add goal:", err);
      alert("Failed to add goal. Please try again.");
    }
  };

  const updateGoalProgress = async (id: string, newProgress: number) => {
    try {
      const data = await api.goals.update(id, { progress: Math.min(100, newProgress) });
      setGoals(prev => prev.map(g => (g._id === id || g.id === id) ? data : g));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Goals Tracking</h1>
          <p className="text-muted-foreground">Track your progress and achieve your dreams</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGoalSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input id="title" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} placeholder="e.g., Learn Spanish" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={newGoalIcon} onValueChange={setNewGoalIcon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Target">Target</SelectItem>
                      <SelectItem value="Dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="Briefcase">Briefcase</SelectItem>
                      <SelectItem value="DollarSign">Finance</SelectItem>
                      <SelectItem value="Book">Book</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Theme Color</Label>
                  <Input type="color" id="color" value={newGoalColor} onChange={(e) => setNewGoalColor(e.target.value)} className="h-10 p-1 w-full" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">Save Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Target className="w-8 h-8 mx-auto text-[#6366f1]" />
              <p className="text-3xl font-bold">{goals.length}</p>
              <p className="text-sm text-muted-foreground">Active Goals</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 mx-auto text-[#10b981]" />
              <p className="text-3xl font-bold">
                {goals.length > 0 
                  ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length) 
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Avg. Progress</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#a855f7]" />
              <p className="text-3xl font-bold">{goals.filter(g => g.progress === 100).length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 mx-auto rounded-full bg-[#f59e0b]/20 flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <p className="text-3xl font-bold">14</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="col-span-full text-center py-20 text-muted-foreground">No goals found. Start by adding one!</div>
        ) : (
          goals.map((goal: any) => {
            const Icon = ICON_MAP[goal.icon] || Target;
            const completedMilestones = (goal.milestones || []).filter((m: any) => m.completed).length;
            const totalMilestones = (goal.milestones || []).length;

            return (
              <Card key={goal._id || goal.id} className="hover:shadow-lg transition-shadow border-2 hover:border-[#6366f1]/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${goal.color || '#6366f1'}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: goal.color || '#6366f1' }} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{goal.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {completedMilestones} / {totalMilestones} milestones
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="font-bold"
                      style={{ borderColor: goal.color || '#6366f1', color: goal.color || '#6366f1' }}
                    >
                      {goal.progress || 0}%
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={goal.progress || 0} className="h-3" />
                    <p className="text-xs text-muted-foreground text-right">
                      {goal.progress || 0}% complete
                    </p>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Milestones</h4>
                    <div className="space-y-1.5">
                      {(goal.milestones || []).map((milestone: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                              milestone.completed
                                ? "bg-[#10b981] border-[#10b981]"
                                : "border-muted-foreground"
                            }`}
                          >
                            {milestone.completed && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm flex-1 ${
                              milestone.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Linked Tasks */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Today's Tasks</h4>
                    <div className="space-y-1.5">
                      {(goal.tasks || []).map((task: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg bg-accent/30 hover:bg-accent transition-colors"
                        >
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                          <span className="text-sm flex-1">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-white"
                      style={{ backgroundColor: goal.color || '#6366f1' }}
                      onClick={() => updateGoalProgress(goal._id, (goal.progress || 0) + 10)}
                    >
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Motivational Card */}
      <Card className="border-2 border-[#a855f7]/20 bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
          <p className="text-muted-foreground">
            You're making excellent progress. Stay consistent and you'll achieve your goals in no time!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
