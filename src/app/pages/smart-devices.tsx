import { useState } from "react";
import { Lightbulb, Thermometer, Lock as LockIcon, Camera, Speaker, Tv, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function SmartDevicesPage() {
  const ICON_MAP: Record<string, any> = {
    light: Lightbulb,
    climate: Thermometer,
    security: LockIcon,
    camera: Camera,
    entertainment: Speaker,
    tv: Tv,
  };

  const COLOR_MAP: Record<string, string> = {
    light: "#f59e0b",
    climate: "#6366f1",
    security: "#10b981",
    camera: "#10b981",
    entertainment: "#a855f7",
    tv: "#a855f7",
  };

  const [devices, setDevices] = useState<any[]>([
    { id: 1, name: "Living Room Lights", type: "light", icon: Lightbulb, status: true, brightness: 75, color: "#f59e0b" },
    { id: 2, name: "Bedroom Lights", type: "light", icon: Lightbulb, status: false, brightness: 0, color: "#f59e0b" },
    { id: 3, name: "Thermostat", type: "climate", icon: Thermometer, status: true, temperature: 72, color: "#6366f1" },
    { id: 4, name: "Front Door Lock", type: "security", icon: LockIcon, status: true, color: "#10b981" },
    { id: 5, name: "Security Camera", type: "security", icon: Camera, status: true, color: "#10b981" },
    { id: 6, name: "Smart Speaker", type: "entertainment", icon: Speaker, status: true, volume: 60, color: "#a855f7" },
    { id: 7, name: "Living Room TV", type: "entertainment", icon: Tv, status: false, color: "#a855f7" },
  ]);

  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("light");
  const [deviceRoom, setDeviceRoom] = useState("Living Room");

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const icon = ICON_MAP[deviceType] || Lightbulb;
    const color = COLOR_MAP[deviceType] || "#6366f1";
    const newDevice: any = {
      id: Date.now(),
      name: deviceName || `New ${deviceType}`,
      type: deviceType,
      icon,
      color,
      status: false,
    };
    if (deviceType === "light") newDevice.brightness = 50;
    if (deviceType === "climate") newDevice.temperature = 70;
    if (deviceType === "entertainment") newDevice.volume = 50;
    setDevices(prev => [...prev, newDevice]);
    setIsAddDeviceOpen(false);
    setDeviceName("");
  };

  const toggleDevice = (id: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: !d.status } : d));
  };

  const rooms = [
    { name: "Living Room", devices: 3, active: 2 },
    { name: "Bedroom", devices: 2, active: 0 },
    { name: "Kitchen", devices: 1, active: 1 },
    { name: "Outdoor", devices: 2, active: 2 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Devices</h1>
          <p className="text-muted-foreground">Control your connected home</p>
        </div>
        <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={() => setIsAddDeviceOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Total Devices</p>
              <p className="text-3xl font-bold">{devices.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-3xl font-bold text-[#10b981]">{devices.filter(d => d.status).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Rooms</p>
              <p className="text-3xl font-bold">{rooms.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Energy Saved</p>
              <p className="text-3xl font-bold">24%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{room.name}</h4>
                  <Badge variant={room.active > 0 ? "default" : "outline"} className={room.active > 0 ? "bg-[#10b981]" : ""}>
                    {room.active} active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{room.devices} devices</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Controls */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <Card key={device.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${device.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: device.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{device.name}</CardTitle>
                        <p className="text-xs text-muted-foreground capitalize">{device.type}</p>
                      </div>
                    </div>
                    <Switch checked={device.status} onCheckedChange={() => toggleDevice(device.id)} />
                  </div>
                </CardHeader>
                
                {device.status && (
                  <CardContent className="space-y-4">
                    {device.type === "light" && device.brightness !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Brightness</span>
                          <span className="font-medium">{device.brightness}%</span>
                        </div>
                        <Slider value={[device.brightness]} max={100} step={1} />
                      </div>
                    )}

                    {device.type === "climate" && device.temperature !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Temperature</span>
                          <span className="font-medium">{device.temperature}°F</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <Button variant="outline" size="sm" className="flex-1">-</Button>
                          <Button variant="outline" size="sm" className="flex-1">+</Button>
                        </div>
                      </div>
                    )}

                    {device.type === "entertainment" && device.volume !== undefined && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Volume</span>
                          <span className="font-medium">{device.volume}%</span>
                        </div>
                        <Slider value={[device.volume]} max={100} step={1} />
                      </div>
                    )}

                    {device.type === "security" && (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#10b981]/10">
                        <span className="text-sm font-medium text-[#10b981]">Secured</span>
                        <Badge className="bg-[#10b981] hover:bg-[#10b981]/90">Active</Badge>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Automation Suggestions */}
      <Card className="border-2 border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5">
        <CardHeader>
          <CardTitle>Smart Automations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">Good Night Routine</p>
                <p className="text-xs text-muted-foreground">Turn off all lights at 11 PM</p>
              </div>
              <Switch />
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">Welcome Home</p>
                <p className="text-xs text-muted-foreground">Turn on lights when you arrive</p>
              </div>
              <Switch />
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">Energy Saver</p>
                <p className="text-xs text-muted-foreground">Auto-adjust thermostat when away</p>
              </div>
              <Switch checked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Device Dialog */}
      <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDevice} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input id="device-name" value={deviceName} onChange={e => setDeviceName(e.target.value)} placeholder="e.g., Kitchen Lights" required />
            </div>
            <div className="space-y-2">
              <Label>Device Type</Label>
              <Select value={deviceType} onValueChange={setDeviceType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">💡 Light</SelectItem>
                  <SelectItem value="climate">🌡️ Climate</SelectItem>
                  <SelectItem value="security">🔒 Security</SelectItem>
                  <SelectItem value="camera">📷 Camera</SelectItem>
                  <SelectItem value="entertainment">🔊 Entertainment</SelectItem>
                  <SelectItem value="tv">📺 TV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Select value={deviceRoom} onValueChange={setDeviceRoom}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Living Room">Living Room</SelectItem>
                  <SelectItem value="Bedroom">Bedroom</SelectItem>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                  <SelectItem value="Outdoor">Outdoor</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-[#6366f1] hover:bg-[#6366f1]/90 text-white">Add Device</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
