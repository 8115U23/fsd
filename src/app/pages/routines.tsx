import { useState, useEffect } from "react";
import { Clock, Sun, Moon, Coffee, Plus, Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../services/api";

const ICON_MAP: Record<string, any> = {
  Sun,
  Moon,
  Coffee,
  Clock,
};

export function RoutinesPage() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [routineName, setRoutineName] = useState("");
  const [routineTime, setRoutineTime] = useState("8:00 AM");
  const [routineDuration, setRoutineDuration] = useState("30");
  const [routineIcon, setRoutineIcon] = useState("Sun");
  const [routineColor, setRoutineColor] = useState("#6366f1");

  // Timer State
  const [activeRoutine, setActiveRoutine] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeRoutine && !isTimerPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (activeRoutine && !isTimerPaused && timeLeft === 0 && activeRoutine.name) {
      completeRoutine(activeRoutine);
    }
    return () => clearInterval(timer);
  }, [activeRoutine, isTimerPaused, timeLeft]);

  const startRoutineTimer = (routine: any) => {
    setActiveRoutine(routine);
    const mins = parseInt(routine.duration) || 30;
    setTimeLeft(mins * 60);
    setIsTimerPaused(false);
  };

  const completeRoutine = async (routine: any) => {
    try {
      const updatedTasks = (routine.tasks || []).map((t: any) => ({ ...t, completed: true }));
      const newStreak = (routine.streak || 0) + 1;
      
      const payload = {
        ...routine,
        tasks: updatedTasks,
        streak: newStreak
      };

      const id = routine._id || routine.id;
      if (id) {
        const data = await api.routines.update(id, payload);
        if (data) {
          setRoutines(routines => routines.map(r => (r._id === id || r.id === id) ? data : r));
        }
      }

      alert(`Awesome! You've completed your ${routine.name} routine! Streak is now ${newStreak} 🔥`);
    } catch (err) {
      console.error("Failed to update routine completion:", err);
    } finally {
      setActiveRoutine(null);
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    setRoutineName("");
    setRoutineTime("8:00 AM");
    setRoutineDuration("30");
    setRoutineIcon("Sun");
    setRoutineColor("#6366f1");
    setIsDialogOpen(true);
  };

  const openEditDialog = (routine: any) => {
    setEditingId(routine._id || routine.id);
    setRoutineName(routine.name);
    setRoutineTime(routine.time);
    setRoutineDuration(parseInt(routine.duration).toString() || "30");
    setRoutineIcon(routine.icon);
    setRoutineColor(routine.color);
    setIsDialogOpen(true);
  };

  const handleSaveRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: routineName || "New Routine",
      time: routineTime || "8:00 AM",
      duration: `${routineDuration} min`,
      icon: routineIcon || "Sun",
      color: routineColor || "#6366f1",
      tasks: [{ time: routineTime || "8:00 AM", task: "Start routine", completed: false }],
      enabled: true
    };
    try {
      if (editingId) {
        const data = await api.routines.update(editingId, payload);
        if (data && (data._id || data.id)) {
          setRoutines(routines.map(r => (r._id === editingId || r.id === editingId) ? { ...r, ...payload } : r));
        } else {
          const all = await api.routines.getAll();
          if (Array.isArray(all)) setRoutines(all);
        }
      } else {
        const data = await api.routines.create(payload);
        if (data && (data._id || data.id)) {
          setRoutines(prev => [...prev, data]);
        } else {
          const all = await api.routines.getAll();
          if (Array.isArray(all)) setRoutines(all);
        }
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Failed to save routine:", err);
      alert("Failed to save routine. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Routine Management</h1>
          <p className="text-muted-foreground">Build consistent daily habits</p>
        </div>
        <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Create Routine
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Active Routines</p>
              <p className="text-3xl font-bold">{routines.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-3xl font-bold">92%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-bold">14 days 🔥</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routine Cards */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading routines...</div>
        ) : routines.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No routines found. Create one to get started!</div>
        ) : (
          routines.map((routine: any) => {
            const Icon = ICON_MAP[routine.icon] || Clock;
            const completedTasks = (routine.tasks || []).filter((t: any) => t.completed).length;

            return (
              <Card key={routine._id || routine.id} className="border-2 hover:border-[#6366f1]/20 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${routine.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: routine.color }} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{routine.name}</CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {routine.time}
                        </span>
                        <Badge variant="outline">{routine.duration}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch checked={routine.enabled} />
                    <Button variant="outline" size="icon">
                      {routine.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {completedTasks} / {routine.tasks.length} completed
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-accent overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: routine.color,
                        width: `${(completedTasks / routine.tasks.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative space-y-2 pl-4">
                  <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-border"></div>
                  {(routine.tasks || []).map((task: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 relative">
                      <div
                        className={`absolute left-[-15px] w-4 h-4 rounded-full border-2 z-10 ${
                          task.completed
                            ? "bg-[#10b981] border-[#10b981]"
                            : "bg-background border-border"
                        }`}
                      />
                      <div className="flex-1 flex items-center justify-between p-2 pl-4 rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-12">{task.time}</span>
                          <span
                            className={`text-sm ${
                              task.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {task.task}
                          </span>
                        </div>
                        {task.completed && (
                          <Badge className="bg-[#10b981] hover:bg-[#10b981]/90 text-xs">Done</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => openEditDialog(routine)}>
                    Edit Routine
                  </Button>
                  <Button className="flex-1" style={{ backgroundColor: routine.color }} onClick={() => startRoutineTimer(routine)}>
                    Start Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
</div>

      {/* Motivational Card */}
      <Card className="border-2 border-[#10b981]/20 bg-gradient-to-r from-[#10b981]/5 to-transparent">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-xl font-bold mb-2">Building Consistency</h3>
          <p className="text-muted-foreground">
            You've maintained your routines for 14 days straight! Keep up the amazing work.
          </p>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Routine" : "Create Routine"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveRoutine} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Routine Name</Label>
              <Input id="name" value={routineName} onChange={(e) => setRoutineName(e.target.value)} placeholder="e.g., Morning Routine" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" value={routineTime} onChange={(e) => setRoutineTime(e.target.value)} placeholder="e.g., 8:00 AM" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (mins)</Label>
                <Input type="number" id="duration" value={routineDuration} onChange={(e) => setRoutineDuration(e.target.value)} placeholder="30" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={routineIcon} onValueChange={setRoutineIcon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sun">Sun</SelectItem>
                    <SelectItem value="Moon">Moon</SelectItem>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                    <SelectItem value="Clock">Clock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Theme Color</Label>
                <Input type="color" id="color" value={routineColor} onChange={(e) => setRoutineColor(e.target.value)} className="h-10 p-1 w-full" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">Save Routine</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Routine Timer Dialog */}
      <Dialog open={!!activeRoutine} onOpenChange={(open) => { if (!open) setActiveRoutine(null); }}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl pt-4">{activeRoutine?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            {activeRoutine && (() => {
              const Icon = ICON_MAP[activeRoutine.icon] || Clock;
              return (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${activeRoutine.color}20` }}
                >
                  <Icon className="w-12 h-12" style={{ color: activeRoutine.color }} />
                </div>
              );
            })()}
            <div className="text-6xl font-light tabular-nums tracking-tighter">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-muted-foreground">{activeRoutine?.tasks?.[0]?.task || "Focus time!"}</p>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
              >
                {isTimerPaused ? "Resume" : "Pause"}
              </Button>
              <Button 
                className="flex-1 text-white"
                style={{ backgroundColor: activeRoutine?.color || '#10b981' }}
                onClick={() => completeRoutine(activeRoutine)}
              >
                Finish Early
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
