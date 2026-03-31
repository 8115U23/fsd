import { useEffect, useState } from "react";
import { Calendar, Clock, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../services/api";

export function PlannerPage() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("10:00 AM");
  const [newEventDuration, setNewEventDuration] = useState("1 hour");
  const [newEventPriority, setNewEventPriority] = useState("medium");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.tasks.getAll();
        if (Array.isArray(data)) {
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (title?: string, time?: string, duration?: string, priority?: string) => {
    const newTask = {
      title: title || "New Task",
      time: time || "10:00 AM",
      duration: duration || "1 hour",
      priority: priority || "medium",
      status: "upcoming",
    };
    try {
      const data = await api.tasks.create(newTask);
      if (data && (data._id || data.id)) {
        setTasks(prev => [...prev, data]);
        return true; // Indicate success
      } else {
        const allTasks = await api.tasks.getAll();
        if (Array.isArray(allTasks)) setTasks(allTasks);
        return true; // Still assume success if we could fetch
      }
    } catch (err) {
      console.error("Failed to add task:", err);
      return false; // Indicate failure
    }
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addTask(newEventTitle, newEventTime, newEventDuration, newEventPriority);
    if (success) {
      setIsDialogOpen(false);
      setNewEventTitle("");
      setNewEventTime("10:00 AM");
      setNewEventDuration("1 hour");
      setNewEventPriority("medium");
    } else {
      alert("Failed to add event. If your session expired, please refresh the page to try again.");
    }
  };

  const suggestedSlots = [
    { time: "10:00 AM - 10:30 AM", activity: "Deep work on project X", type: "focus" },
    { time: "3:00 PM - 3:15 PM", activity: "Quick meditation break", type: "wellness" },
    { time: "7:30 PM - 8:00 PM", activity: "Read or learn something new", type: "personal" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Planner & Time Management</h1>
          <p className="text-muted-foreground">Organize your day efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEventSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="e.g., Team Meeting" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)} placeholder="e.g., 10:00 AM" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" value={newEventDuration} onChange={(e) => setNewEventDuration(e.target.value)} placeholder="e.g., 1 hour" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newEventPriority} onValueChange={setNewEventPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">Save Event</Button>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* View Toggle & Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Tabs value={view} onValueChange={(v) => setView(v as "daily" | "weekly")} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <p className="font-medium">Monday, March 23</p>
                <p className="text-xs text-muted-foreground">Week 12, 2026</p>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">Today</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar/Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Focus Hours Highlight */}
          <Card className="border-2 border-[#10b981]/20 bg-gradient-to-r from-[#10b981]/5 to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Focus Hours (9:00 AM - 12:00 PM)</CardTitle>
                <Badge className="bg-[#10b981] hover:bg-[#10b981]/90">Peak Time</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your most productive hours! Schedule deep work and important tasks here.
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tasks scheduled for today.</div>
              ) : (
                tasks.map((task, index) => (
                  <div
                    key={task._id || task.id || index}
                    className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <span className="text-sm font-medium">{task.time || "No time"}</span>
                      <span className="text-xs text-muted-foreground">{task.duration || ""}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{task.title}</h4>
                        {task.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">High</Badge>
                        )}
                        {task.priority === "medium" && (
                          <Badge variant="secondary" className="text-xs">Medium</Badge>
                        )}
                      </div>
                      <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            task.priority === "high"
                              ? "bg-[#d4183d]"
                              : task.priority === "medium"
                              ? "bg-[#6366f1]"
                              : "bg-muted-foreground"
                          }`}
                          style={{ width: task.status === "completed" ? "100%" : "0%" }}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Edit
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Suggested Time Slots */}
          <Card className="border-2 border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#6366f1]" />
                Suggested Slots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedSlots.map((slot, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {slot.time}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        slot.type === "focus"
                          ? "border-[#6366f1] text-[#6366f1]"
                          : slot.type === "wellness"
                          ? "border-[#10b981] text-[#10b981]"
                          : "border-[#a855f7] text-[#a855f7]"
                      }
                    >
                      {slot.type}
                    </Badge>
                  </div>
                  <p className="text-sm">{slot.activity}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => addTask(slot.activity, slot.time)}>
                    Add to Schedule
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Mini Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">March 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-muted-foreground font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2;
                  const isToday = day === 23;
                  const isCurrentMonth = day > 0 && day <= 31;
                  
                  return (
                    <button
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center hover:bg-accent transition-colors ${
                        isToday
                          ? "bg-[#6366f1] text-white font-medium"
                          : !isCurrentMonth
                          ? "text-muted-foreground/50"
                          : ""
                      }`}
                    >
                      {isCurrentMonth ? day : ""}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => { setNewEventTitle("Meeting: "); setIsDialogOpen(true); }}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => { setNewEventTitle("Reminder: "); setIsDialogOpen(true); }}>
                <Clock className="w-4 h-4 mr-2" />
                Set Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => { setNewEventTitle(""); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
