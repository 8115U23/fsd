import { AlertCircle, Phone, MapPin, Heart, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export function EmergencyPage() {
  const emergencyContacts = [
    { id: 1, name: "Emergency Services", number: "911", type: "Emergency", icon: "🚨" },
    { id: 2, name: "Mom", number: "+1 (555) 123-4567", type: "Family", icon: "👩" },
    { id: 3, name: "Dad", number: "+1 (555) 234-5678", type: "Family", icon: "👨" },
    { id: 4, name: "Dr. Sarah Johnson", number: "+1 (555) 345-6789", type: "Medical", icon: "⚕️" },
    { id: 5, name: "Best Friend - Mike", number: "+1 (555) 456-7890", type: "Friend", icon: "👤" },
  ];

  const quickActions = [
    { title: "Call Emergency Services", subtitle: "Dial 911", icon: Phone, color: "#d4183d" },
    { title: "Share Location", subtitle: "Send your current location", icon: MapPin, color: "#6366f1" },
    { title: "Medical Info", subtitle: "View health details", icon: Heart, color: "#10b981" },
    { title: "Emergency Profile", subtitle: "Important information", icon: User, color: "#f59e0b" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header with Warning */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d4183d]/10 mb-4">
          <AlertCircle className="w-10 h-10 text-[#d4183d]" />
        </div>
        <h1 className="text-3xl font-bold">Emergency</h1>
        <p className="text-muted-foreground">Quick access to emergency services and contacts</p>
      </div>

      {/* SOS Button */}
      <Card className="border-4 border-[#d4183d] bg-gradient-to-br from-[#d4183d]/10 to-[#d4183d]/5 shadow-2xl">
        <CardContent className="p-8 text-center">
          <button className="w-48 h-48 rounded-full bg-[#d4183d] hover:bg-[#d4183d]/90 active:scale-95 transition-all shadow-2xl flex items-center justify-center mx-auto group">
            <div className="text-center">
              <div className="text-6xl mb-2 group-active:scale-110 transition-transform">🆘</div>
              <p className="text-white text-2xl font-bold">SOS</p>
            </div>
          </button>
          <p className="text-sm text-muted-foreground mt-6">
            Hold for 3 seconds to activate emergency alert
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[#6366f1]/20"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: action.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-2xl">
                  {contact.icon}
                </div>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{contact.type}</Badge>
                <Button
                  size="sm"
                  className={
                    contact.type === "Emergency"
                      ? "bg-[#d4183d] hover:bg-[#d4183d]/90"
                      : "bg-[#10b981] hover:bg-[#10b981]/90"
                  }
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="border-2 border-[#10b981]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#10b981]" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <p className="font-medium">O+</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Allergies</p>
              <p className="font-medium">Penicillin</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Medical Conditions</p>
              <p className="font-medium">None</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Medications</p>
              <p className="font-medium">None</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Edit Medical Info
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#f59e0b]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No emergency calls or alerts</p>
            <p className="text-xs mt-1">Stay safe!</p>
          </div>
        </CardContent>
      </Card>

      {/* Safety Notice */}
      <Card className="border-2 border-[#f59e0b]/20 bg-gradient-to-r from-[#f59e0b]/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="font-medium mb-2">Safety Reminder</h3>
              <p className="text-sm text-muted-foreground">
                In a real emergency, always call your local emergency services immediately. 
                This feature is designed to complement, not replace, emergency services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
