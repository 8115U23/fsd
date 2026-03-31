import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function FocusModePage() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [totalTime] = useState(25 * 60);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Minimal Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Focus Mode</h1>
          <p className="text-sm text-muted-foreground">Deep work session</p>
        </div>

        {/* Timer Card */}
        <Card className="border-2 border-[#6366f1]/20 shadow-2xl">
          <CardContent className="p-12">
            <div className="space-y-12">
              {/* Progress Ring */}
              <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
                {/* Background Circle */}
                <svg className="absolute inset-0 transform -rotate-90" width="280" height="280">
                  <circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-accent"
                  />
                  <motion.circle
                    cx="140"
                    cy="140"
                    r="120"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                    initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Timer Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isActive ? "Stay focused..." : "Ready to focus?"}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={handleReset}
                  disabled={timeLeft === totalTime}
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>

                <Button
                  size="icon"
                  className="h-20 w-20 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:opacity-90 shadow-xl"
                  onClick={() => setIsActive(!isActive)}
                >
                  {isActive ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full"
                  onClick={() => window.history.back()}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Session Info */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-xs text-muted-foreground">Session</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold">25</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/50">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Silence notifications and put your phone away for better focus.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
