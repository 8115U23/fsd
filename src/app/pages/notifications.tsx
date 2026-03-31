import { Bell, Check, X, Archive, Filter, Settings } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function NotificationsPage() {
  const notifications = [
    { id: 1, type: "important", title: "Team Meeting in 15 minutes", message: "Don't forget your presentation slides", time: "5m ago", read: false, category: "calendar" },
    { id: 2, type: "general", title: "New message from Sarah", message: "Hey! The designs look great...", time: "1h ago", read: false, category: "message" },
    { id: 3, type: "important", title: "Goal milestone reached!", message: "You've completed 75% of your fitness goal", time: "2h ago", read: false, category: "goal" },
    { id: 4, type: "general", title: "Task completed", message: "Weekly report has been finished", time: "3h ago", read: true, category: "task" },
    { id: 5, type: "general", title: "Weather alert", message: "Rain expected this afternoon", time: "4h ago", read: true, category: "weather" },
    { id: 6, type: "important", title: "Low budget warning", message: "You've used 85% of monthly budget", time: "1d ago", read: true, category: "finance" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="text-muted-foreground">
            {notifications.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm">
          <Check className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
        <Button variant="outline" size="sm">
          <Archive className="w-4 h-4 mr-2" />
          Clear all
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="important">
            Important
            <Badge variant="secondary" className="ml-2">
              {notifications.filter((n) => n.type === "important").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2">
              {notifications.filter((n) => !n.read).length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? "border-l-4 border-l-[#6366f1] bg-accent/30" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      !notification.read ? "bg-[#6366f1]" : "bg-transparent"
                    }`}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{notification.title}</h4>
                        {notification.type === "important" && (
                          <Badge variant="destructive" className="text-xs">Important</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {notification.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Check className="w-4 h-4 text-[#10b981]" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="important" className="space-y-2">
          {notifications
            .filter((n) => n.type === "important")
            .map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-[#6366f1] bg-accent/30" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.read ? "bg-[#6366f1]" : "bg-transparent"
                      }`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>

                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-2">
          {notifications
            .filter((n) => !n.read)
            .map((notification) => (
              <Card
                key={notification.id}
                className="transition-all hover:shadow-md border-l-4 border-l-[#6366f1] bg-accent/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#6366f1] mt-2" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{notification.title}</h4>
                          {notification.type === "important" && (
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Empty State (Hidden when there are notifications) */}
      {notifications.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No notifications</h3>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
