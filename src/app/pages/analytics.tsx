import { BarChart3, TrendingUp, Clock, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function AnalyticsPage() {
  const productivityData = [
    { day: "Mon", score: 85, hours: 7.5 },
    { day: "Tue", score: 92, hours: 8.2 },
    { day: "Wed", score: 78, hours: 6.5 },
    { day: "Thu", score: 88, hours: 7.8 },
    { day: "Fri", score: 95, hours: 8.5 },
    { day: "Sat", score: 70, hours: 5.0 },
    { day: "Sun", score: 65, hours: 4.5 },
  ];

  const timeUsageData = [
    { name: "Work", value: 35, color: "#6366f1" },
    { name: "Wellness", value: 15, color: "#10b981" },
    { name: "Learning", value: 20, color: "#a855f7" },
    { name: "Social", value: 10, color: "#f59e0b" },
    { name: "Other", value: 20, color: "#94a3b8" },
  ];

  const activityBreakdown = [
    { activity: "Deep Work", hours: 28 },
    { activity: "Meetings", hours: 12 },
    { activity: "Exercise", hours: 10 },
    { activity: "Reading", hours: 8 },
    { activity: "Meditation", hours: 3.5 },
    { activity: "Social", hours: 7 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your productivity and activities</p>
        </div>
        <Tabs defaultValue="weekly" className="w-auto">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity Score</p>
                <p className="text-3xl font-bold mt-2">87%</p>
                <p className="text-xs text-[#10b981] mt-1">+8% from last week</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#6366f1]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Focus Hours</p>
                <p className="text-3xl font-bold mt-2">48h</p>
                <p className="text-xs text-[#6366f1] mt-1">This week</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goals Progress</p>
                <p className="text-3xl font-bold mt-2">75%</p>
                <p className="text-xs text-[#a855f7] mt-1">3 of 4 on track</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#a855f7]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#a855f7]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Streak</p>
                <p className="text-3xl font-bold mt-2">21</p>
                <p className="text-xs text-[#f59e0b] mt-1">Days 🔥</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#f59e0b]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Score Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#6366f1]" />
              Weekly Productivity Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Focus Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#10b981]" />
              Focus Hours This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Usage Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {timeUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityBreakdown.map((activity, index) => {
                const percentage = (activity.hours / 68.5) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{activity.activity}</span>
                      <span className="text-muted-foreground">{activity.hours}h</span>
                    </div>
                    <div className="h-2 rounded-full bg-accent overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="border-2 border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#6366f1]" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <Badge className="bg-[#10b981] hover:bg-[#10b981]/90">✓</Badge>
            <div>
              <p className="font-medium">Great productivity this week!</p>
              <p className="text-sm text-muted-foreground">
                You averaged 87% productivity score, which is 8% higher than last week.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <Badge className="bg-[#f59e0b] hover:bg-[#f59e0b]/90">!</Badge>
            <div>
              <p className="font-medium">Consider more breaks</p>
              <p className="text-sm text-muted-foreground">
                Your focus sessions averaged 3 hours. Taking short breaks every 90 minutes can boost productivity.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <Badge className="bg-[#6366f1] hover:bg-[#6366f1]/90">→</Badge>
            <div>
              <p className="font-medium">Peak performance hours</p>
              <p className="text-sm text-muted-foreground">
                You're most productive between 9 AM - 12 PM. Schedule important tasks during this window.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
