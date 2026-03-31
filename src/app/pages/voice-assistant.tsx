import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { Mic, Send, Volume2, Clock, Calendar, CheckCircle2, Sparkles, MicOff } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { motion } from "motion/react";

export function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  const navigationMap: Record<string, string> = {
    goal: "/goals",
    planner: "/planner",
    calendar: "/planner",
    wellness: "/wellness",
    health: "/wellness",
    routine: "/routines",
    habit: "/routines",
    collab: "/collaboration",
    team: "/collaboration",
    shopping: "/shopping",
    grocery: "/shopping",
    expense: "/shopping",
    message: "/communication",
    chat: "/communication",
    document: "/documents",
    file: "/documents",
    device: "/devices",
    smart: "/devices",
    focus: "/focus",
    editor: "/editor",
    notification: "/notifications",
    emergency: "/emergency",
    profile: "/profile",
    setting: "/profile",
    home: "/",
    dashboard: "/",
  };

  const [commands, setCommands] = useState([
    { command: "Schedule a meeting for tomorrow at 3 PM", response: "Meeting scheduled for March 24 at 3:00 PM", time: "2 min ago" },
    { command: "What's on my calendar today?", response: "You have 3 events: Team standup at 9 AM, Design review at 11 AM, and Gym at 6 PM", time: "1 hour ago" },
    { command: "Add milk to shopping list", response: "Added milk to your shopping list", time: "3 hours ago" },
  ]);

  const generateResponse = (cmd: string): string => {
    const lower = cmd.toLowerCase();
    if (lower.includes("schedule") || lower.includes("meeting")) return `I'll schedule that for you. Calendar updated!`;
    if (lower.includes("reminder") || lower.includes("remind")) return `Reminder set! I'll notify you at the specified time.`;
    if (lower.includes("add") && lower.includes("list")) return `Added to your shopping list successfully.`;
    if (lower.includes("weather")) return `Currently 72°F and sunny. A great day to be productive!`;
    if (lower.includes("task") || lower.includes("complete")) return `Task marked as complete. Great work!`;
    if (lower.includes("music") || lower.includes("play")) return `Starting your focus playlist. Enjoy!`;
    if (lower.includes("calendar") || lower.includes("schedule")) return `You have 3 events scheduled for today.`;
    return `Got it! Processing your request: "${cmd}"`;
  };

  const handleSend = useCallback((text?: string) => {
    const finalText = (text ?? inputText).trim();
    if (!finalText) return;
    
    // Check for navigation commands
    const lower = finalText.toLowerCase();
    if (lower.includes("go to ") || lower.includes("open ") || lower.includes("navigate to ") || lower.includes("take me to ")) {
      for (const [key, path] of Object.entries(navigationMap)) {
        if (lower.includes(key)) {
          navigate(path);
          return; // Skip adding to chat to let it navigate
        }
      }
    }

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    const entry = { command: finalText, response: generateResponse(finalText), time: `Just now (${timeStr})` };
    setCommands(prev => [entry, ...prev.slice(0, 9)]);
    setInputText("");
    setTranscript("");
  }, [inputText, navigate]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice recognition. Please try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const result = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(result);
      setInputText(result);
      if (event.results[event.results.length - 1].isFinal) {
        handleSend(result);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const quickActions = [
    { text: "What's my schedule today?", icon: Calendar },
    { text: "Set a reminder", icon: Clock },
    { text: "Mark task as complete", icon: CheckCircle2 },
    { text: "Play focus music", icon: Volume2 },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Voice Assistant</h1>
        <p className="text-muted-foreground">Ask me anything about your day</p>
      </div>

      {/* Voice Interaction Area */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md border-2 border-[#6366f1]/20">
          <CardContent className="p-8 text-center space-y-6">
            {/* Microphone Button */}
            <motion.div
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
              className="relative mx-auto"
            >
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? "bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-2xl shadow-[#6366f1]/50"
                    : "bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 hover:from-[#6366f1]/30 hover:to-[#a855f7]/30"
                }`}
              >
                {isListening
                  ? <MicOff className="w-12 h-12 text-white" />
                  : <Mic className={`w-12 h-12 text-[#6366f1]`} />
                }
              </button>
              
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-[#6366f1]"
                  animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </motion.div>

            {/* Status */}
            <div className="space-y-2">
              {isListening ? (
                <>
                  <Badge className="bg-[#d4183d] hover:bg-[#d4183d]/90">Listening...</Badge>
                  <p className="text-sm text-muted-foreground">Speak your command — tap mic to stop</p>
                </>
              ) : (
                <>
                  <Badge variant="outline">Ready</Badge>
                  <p className="text-sm text-muted-foreground">Tap to speak</p>
                </>
              )}
            </div>

            {/* Live Transcript */}
            {(isListening || transcript) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-accent"
              >
                <p className="text-sm italic">
                  {transcript ? `"${transcript}"` : '"Listening..."'}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground text-center">Quick Commands</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="justify-start gap-2 h-auto py-3"
                onClick={() => { setInputText(action.text); handleSend(action.text); }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{action.text}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Text Input Alternative */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your command..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1"
            />
            <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90" onClick={() => handleSend()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Commands */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recent Commands</h3>
            <Sparkles className="w-4 h-4 text-[#f59e0b]" />
          </div>
          
          <div className="space-y-3">
            {commands.map((item, index) => (
              <div key={index} className="space-y-2 p-3 rounded-lg bg-accent/50">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">"{item.command}"</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
                <p className="text-sm text-muted-foreground pl-3 border-l-2 border-[#6366f1]">
                  {item.response}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
