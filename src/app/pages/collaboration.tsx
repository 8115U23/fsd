import { useState, useEffect } from "react";
import { Users, Calendar, CheckCircle2, MessageSquare, UserPlus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { api } from "../services/api";

export function CollaborationPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await api.team.getAll();
        setTeamMembers(data.length ? data : [
          { id: 1, name: "Sarah Johnson", role: "Designer", initials: "SJ", status: "online" },
          { id: 2, name: "Mike Chen", role: "Developer", initials: "MC", status: "online" }
        ]); 
      } catch (err) {
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const initials = inviteName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2) || "TM";
    try {
      const data = await api.team.create({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        initials: initials,
        status: "offline"
      });
      setTeamMembers(prev => [...prev, data]);
      setIsInviteOpen(false);
      setInviteName("");
      setInviteEmail("");
    } catch (err) {
      console.error("Failed to invite member", err);
    }
  };

  const sharedTasks = [
    { id: 1, title: "Design homepage mockup", assignedTo: "Sarah Johnson", dueDate: "Mar 24", priority: "high", status: "in-progress" },
    { id: 2, title: "API integration", assignedTo: "Mike Chen", dueDate: "Mar 25", priority: "high", status: "in-progress" },
    { id: 3, title: "User research summary", assignedTo: "Emma Wilson", dueDate: "Mar 26", priority: "medium", status: "todo" },
    { id: 4, title: "Database optimization", assignedTo: "Alex Kumar", dueDate: "Mar 27", priority: "medium", status: "todo" },
  ];

  const activity = [
    { user: "Sarah Johnson", action: "completed", item: "Mobile UI designs", time: "10 min ago", avatar: "SJ" },
    { user: "Mike Chen", action: "commented on", item: "Backend architecture", time: "25 min ago", avatar: "MC" },
    { user: "Emma Wilson", action: "assigned", item: "Sprint planning task", time: "1 hour ago", avatar: "EW" },
    { user: "Alex Kumar", action: "updated", item: "Project timeline", time: "2 hours ago", avatar: "AK" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Team Collaboration</h1>
          <p className="text-muted-foreground">Work together seamlessly</p>
        </div>
        <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Users className="w-8 h-8 mx-auto text-[#6366f1]" />
              <p className="text-3xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#10b981]" />
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Clock className="w-8 h-8 mx-auto text-[#f59e0b]" />
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-[#a855f7]" />
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Meetings Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shared Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6366f1]" />
                Shared Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="w-1.5 h-full bg-[#6366f1] rounded-full mt-1"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Team Standup</p>
                      <Badge variant="outline">9:00 AM</Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {teamMembers.slice(0, 3).map((member, i) => (
                        <Avatar key={member.id || member._id || i} className="w-6 h-6">
                          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      <span className="text-xs text-muted-foreground">+ everyone</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="w-1.5 h-full bg-[#a855f7] rounded-full mt-1"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Design Review</p>
                      <Badge variant="outline">2:00 PM</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">SJ</AvatarFallback>
                      </Avatar>
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">EW</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="w-1.5 h-full bg-[#10b981] rounded-full mt-1"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Sprint Planning</p>
                      <Badge variant="outline">4:00 PM</Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {teamMembers.map((member, i) => (
                        <Avatar key={member.id || member._id || i} className="w-6 h-6">
                          <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                Shared Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sharedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">Due {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.priority === "high" && (
                      <Badge variant="destructive" className="text-xs">High</Badge>
                    )}
                    {task.priority === "medium" && (
                      <Badge variant="secondary" className="text-xs">Medium</Badge>
                    )}
                    {task.status === "in-progress" && (
                      <Badge className="bg-[#6366f1] hover:bg-[#6366f1]/90 text-xs">In Progress</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Team Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member, i) => (
                <div key={member.id || member._id || i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        member.status === "online"
                          ? "bg-[#10b981]"
                          : member.status === "away"
                          ? "bg-[#f59e0b]"
                          : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{item.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>{" "}
                      <span className="font-medium">{item.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Invite Member Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="e.g., Jane Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" id="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="jane@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">Send Invite</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
