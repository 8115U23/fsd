import { Calendar, CheckCircle2, Heart, Bell, MapPin, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Greeting Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">{greeting}, Alex</h1>
        <p className="text-muted-foreground">Ready to make today amazing?</p>
      </div>

      {/* Context Suggestion Banner */}
      <Card className="border-2 border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#6366f1]" />
            <div>
              <p className="font-medium">You're near your gym</p>
              <p className="text-sm text-muted-foreground">Perfect time for a workout!</p>
            </div>
          </div>
          <Button size="sm" className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={() => navigate('/wellness')}>
            Start Workout
          </Button>
        </CardContent>
      </Card>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <Calendar className="w-5 h-5 text-[#6366f1]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="w-1.5 h-full bg-[#6366f1] rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Team Meeting</p>
                  <p className="text-xs text-muted-foreground">9:00 AM - 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="w-1.5 h-full bg-[#a855f7] rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Gym Session</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="w-1.5 h-full bg-[#10b981] rounded-full mt-1"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Project Review</p>
                  <p className="text-xs text-muted-foreground">4:00 PM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Tasks Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Tasks Overview</CardTitle>
            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium">8 / 12</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                <span className="text-sm flex-1">Finish presentation slides</span>
                <Badge variant="secondary" className="text-xs">High</Badge>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                <span className="text-sm flex-1">Review pull requests</span>
                <Badge variant="outline" className="text-xs">Medium</Badge>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                <span className="text-sm flex-1">Call dentist</span>
                <Badge variant="outline" className="text-xs">Low</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Mood Status */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Mood & Wellness</CardTitle>
            <Heart className="w-5 h-5 text-[#f472b6]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl mb-2">😊</div>
              <p className="font-medium">Feeling Great!</p>
              <p className="text-xs text-muted-foreground">Last updated 2 hours ago</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Energy Level</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2 [&>div]:bg-[#10b981]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stress Level</span>
                <span className="font-medium">25%</span>
              </div>
              <Progress value={25} className="h-2 [&>div]:bg-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Preview */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Bell className="w-5 h-5 text-[#f59e0b]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="w-2 h-2 rounded-full bg-[#6366f1] mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New message from Sarah</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="w-2 h-2 rounded-full bg-muted mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm">Task completed: Weekly report</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                <div className="w-2 h-2 rounded-full bg-muted mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-sm">Reminder: Doctor appointment</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              View All Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <TrendingUp className="w-5 h-5 text-[#10b981]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Productivity</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-[#10b981]">+5% from yesterday</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Focus Hours</p>
                <p className="text-2xl font-bold">6.5h</p>
                <p className="text-xs text-[#6366f1]">Today's total</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Active Goals</p>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">3 on track, 2 need attention</p>
            </div>
          </CardContent>
        </Card>

        {/* Productivity Boost */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-2 border-[#f59e0b]/20 bg-gradient-to-br from-[#f59e0b]/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Productivity Boost</CardTitle>
            <Zap className="w-5 h-5 text-[#f59e0b]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You're most productive between 9 AM - 12 PM. Schedule important tasks during this time!
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                🎯 Schedule deep work
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                ☕ Take a break at 3 PM
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
