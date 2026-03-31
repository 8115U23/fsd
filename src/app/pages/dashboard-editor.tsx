import { Layout, Plus, Grid, Edit, Trash2, Move, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export function DashboardEditorPage() {
  const availableWidgets = [
    { id: "schedule", name: "Today's Schedule", icon: "📅", category: "Productivity" },
    { id: "tasks", name: "Tasks Overview", icon: "✓", category: "Productivity" },
    { id: "mood", name: "Mood Tracker", icon: "😊", category: "Wellness" },
    { id: "weather", name: "Weather", icon: "☀️", category: "Info" },
    { id: "goals", name: "Goals Progress", icon: "🎯", category: "Goals" },
    { id: "analytics", name: "Quick Stats", icon: "📊", category: "Analytics" },
  ];

  const currentWidgets = [
    { id: 1, type: "schedule", position: { row: 1, col: 1 }, size: "medium" },
    { id: 2, type: "tasks", position: { row: 1, col: 2 }, size: "medium" },
    { id: 3, type: "mood", position: { row: 2, col: 1 }, size: "small" },
    { id: 4, type: "weather", position: { row: 2, col: 2 }, size: "small" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Editor</h1>
          <p className="text-muted-foreground">Customize your dashboard layout</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Reset</Button>
          <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90">
            <Save className="w-4 h-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Widget Library */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Available Widgets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableWidgets.map((widget) => (
              <div
                key={widget.id}
                className="p-3 rounded-lg border-2 border-dashed border-border hover:border-[#6366f1] hover:bg-accent transition-all cursor-move group"
                draggable
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{widget.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{widget.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">{widget.category}</Badge>
                  </div>
                  <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-2 border-dashed border-[#6366f1]/30 bg-gradient-to-br from-accent/30 to-transparent min-h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Canvas</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3x3 Grid</Badge>
                  <Button variant="outline" size="sm">
                    <Layout className="w-4 h-4 mr-2" />
                    Change Layout
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Grid System */}
              <div className="grid grid-cols-3 gap-4 min-h-[500px]">
                {Array.from({ length: 9 }).map((_, index) => {
                  const widget = currentWidgets.find(
                    (w) => (w.position.row - 1) * 3 + (w.position.col - 1) === index
                  );

                  return (
                    <div
                      key={index}
                      className={`relative rounded-lg border-2 border-dashed border-border hover:border-[#6366f1] transition-colors p-4 ${
                        widget ? "bg-card border-solid" : "bg-accent/20"
                      }`}
                    >
                      {widget ? (
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Move className="w-4 h-4 text-muted-foreground cursor-move" />
                              <span className="font-medium text-sm">
                                {availableWidgets.find((w) => w.id === widget.type)?.name}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center justify-center text-4xl">
                            {availableWidgets.find((w) => w.id === widget.type)?.icon}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          <Plus className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <p className="font-medium mb-1">How to customize</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Drag widgets from the library to the canvas</li>
                    <li>• Click and drag existing widgets to rearrange</li>
                    <li>• Use the edit icon to configure widget settings</li>
                    <li>• Remove widgets by clicking the trash icon</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
