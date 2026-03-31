import { useState, useEffect } from "react";
import { Heart, Activity, Music, Coffee, Book, Wind, Smile, Frown, Meh } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { api } from "../services/api";

export function WellnessPage() {
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [stressLevel, setStressLevel] = useState([30]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeActivity, setActiveActivity] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeActivity && !isTimerPaused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (activeActivity && !isTimerPaused && timeLeft === 0 && activeActivity.title) {
      completeActivity(activeActivity);
    }
    return () => clearInterval(timer);
  }, [activeActivity, isTimerPaused, timeLeft]);

  const startActivity = (activity: any) => {
    setActiveActivity(activity);
    setTimeLeft(parseInt(activity.duration) * 60);
    setIsTimerPaused(false);
  };

  const completeActivity = async (activity: any) => {
    try {
      const newLog = {
        type: 'activity',
        value: 5,
        notes: `Completed: ${activity.title}`,
      };
      const data = await api.wellness.create(newLog);
      setHistory(prev => [data, ...prev]);
      alert(`Great job completing ${activity.title}! It has been logged to your history.`);
    } catch (err) {
      console.error("Failed to save activity:", err);
    } finally {
      setActiveActivity(null);
    }
  };

  useEffect(() => {
    const fetchWellness = async () => {
      try {
        const data = await api.wellness.getAll();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch wellness data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWellness();
  }, []);

  const saveMood = async () => {
    try {
      const newLog = {
        type: 'mood',
        value: moodOptions.findIndex(m => m.id === selectedMood),
        notes: `Selected mood: ${selectedMood}, Stress level: ${stressLevel[0]}%`,
      };
      const data = await api.wellness.create(newLog);
      setHistory(prev => [data, ...prev]);
      alert("Wellness log saved!");
    } catch (err) {
      console.error("Failed to save mood:", err);
    }
  };

  const moodOptions = [
    { id: "very-happy", emoji: "😄", label: "Amazing", color: "#10b981" },
    { id: "happy", emoji: "😊", label: "Good", color: "#6366f1" },
    { id: "neutral", emoji: "😐", label: "Okay", color: "#f59e0b" },
    { id: "sad", emoji: "😔", label: "Down", color: "#f97316" },
    { id: "very-sad", emoji: "😢", label: "Struggling", color: "#d4183d" },
  ];

  const suggestions = [
    {
      title: "5-Minute Meditation",
      description: "Clear your mind with a quick guided session",
      icon: Wind,
      color: "#6366f1",
      duration: "5 min",
    },
    {
      title: "Take a Break",
      description: "Step away from work and refresh",
      icon: Coffee,
      color: "#f59e0b",
      duration: "15 min",
    },
    {
      title: "Listen to Music",
      description: "Relax with your favorite calming playlist",
      icon: Music,
      color: "#a855f7",
      duration: "20 min",
    },
    {
      title: "Breathing Exercise",
      description: "Deep breathing to reduce stress",
      icon: Activity,
      color: "#10b981",
      duration: "3 min",
    },
    {
      title: "Read Something Light",
      description: "Engage your mind with a good book",
      icon: Book,
      color: "#3b82f6",
      duration: "30 min",
    },
  ];

  const moodHistory = [
    { day: "Mon", mood: "😊", energy: 80 },
    { day: "Tue", mood: "😄", energy: 90 },
    { day: "Wed", mood: "😐", energy: 60 },
    { day: "Thu", mood: "😊", energy: 75 },
    { day: "Fri", mood: "😄", energy: 85 },
    { day: "Sat", mood: "😊", energy: 70 },
    { day: "Sun", mood: "😊", energy: 80 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mental Wellness</h1>
        <p className="text-muted-foreground">Take care of your mental health</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Selector */}
          <Card className="border-2 border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#f472b6]" />
                How are you feeling today?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedMood === mood.id
                        ? "border-[#6366f1] bg-[#6366f1]/5 shadow-lg"
                        : "border-border hover:border-[#6366f1]/50"
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-xs font-medium text-center">{mood.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="text-center pt-2">
                <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={saveMood}>
                  Save Mood
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stress Level Indicator */}
          <Card>
            <CardHeader>
              <CardTitle>Stress Level Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Stress</span>
                  <Badge
                    variant="outline"
                    className={
                      stressLevel[0] < 30
                        ? "border-[#10b981] text-[#10b981]"
                        : stressLevel[0] < 70
                        ? "border-[#f59e0b] text-[#f59e0b]"
                        : "border-[#d4183d] text-[#d4183d]"
                    }
                  >
                    {stressLevel[0]}%
                  </Badge>
                </div>
                
                <Slider
                  value={stressLevel}
                  onValueChange={setStressLevel}
                  max={100}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>😌 Relaxed</span>
                  <span>😰 Very Stressed</span>
                </div>
              </div>

              {stressLevel[0] > 60 && (
                <div className="p-4 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20">
                  <p className="text-sm font-medium text-[#f59e0b]">
                    ⚠️ Your stress level seems high. Consider taking a break or trying one of our wellness activities.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wellness Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-all hover:shadow-md group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${suggestion.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: suggestion.color }} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{suggestion.duration}</Badge>
                      <Button
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: suggestion.color }}
                        onClick={() => startActivity(suggestion)}
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Mood Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading history...</p>
                ) : history.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No logs yet.</p>
                ) : (
                  history.slice(0, 7).map((entry, index) => (
                    <div key={entry._id || index} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-12">
                        {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </span>
                      <span className="text-2xl">
                        {moodOptions[entry.value]?.emoji || "😊"}
                      </span>
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground truncate">{entry.notes}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-[#6366f1]/5 to-[#a855f7]/5">
            <CardHeader>
              <CardTitle className="text-lg">Wellness Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Mood</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">😊</span>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meditation Streak</span>
                  <span className="text-sm font-medium">7 days 🔥</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wellness Score</span>
                  <Badge className="bg-[#10b981] hover:bg-[#10b981]/90">8.5/10</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Breathing Exercise Quick Access */}
          <Card className="border-2 border-[#10b981]/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#10b981]/20 flex items-center justify-center">
                <Wind className="w-8 h-8 text-[#10b981]" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Quick Breathing</h3>
                <p className="text-xs text-muted-foreground">
                  4-7-8 technique for instant calm
                </p>
              </div>
              <Button className="w-full bg-[#10b981] hover:bg-[#10b981]/90" onClick={() => startActivity(suggestions[3])}>
                Start Now
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Resources */}
          <Card className="border-2 border-[#d4183d]/20">
            <CardHeader>
              <CardTitle className="text-lg text-[#d4183d]">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                If you're in crisis or need immediate support:
              </p>
              <Button variant="outline" className="w-full justify-start text-[#d4183d] border-[#d4183d]/50">
                Crisis Hotline
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Professional Help
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Timer Dialog */}
      <Dialog open={!!activeActivity} onOpenChange={(open) => { if (!open) setActiveActivity(null); }}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl pt-4">{activeActivity?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            {activeActivity && (() => {
              const Icon = activeActivity.icon;
              return (
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${activeActivity.color}20` }}
                >
                  <Icon className="w-12 h-12" style={{ color: activeActivity.color }} />
                </div>
              );
            })()}
            <div className="text-6xl font-light tabular-nums tracking-tighter">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-muted-foreground">{activeActivity?.description}</p>
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
                className="flex-1 bg-[#10b981] hover:bg-[#10b981]/90 text-white"
                onClick={() => completeActivity(activeActivity)}
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
