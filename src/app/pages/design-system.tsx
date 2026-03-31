import { useState } from "react";
import { Palette, Type, Layout, Zap, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export function DesignSystemPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#6366f1");

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1800);
    }).catch(() => {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = hex;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1800);
    });
  };

  const brandColors = [
    { name: "Primary Blue", hex: "#6366f1" },
    { name: "Primary Purple", hex: "#a855f7" },
    { name: "Success", hex: "#10b981" },
    { name: "Warning", hex: "#f59e0b" },
    { name: "Destructive", hex: "#d4183d" },
    { name: "Sky Blue", hex: "#3b82f6" },
    { name: "Orange", hex: "#f97316" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Rose", hex: "#e11d48" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Design System</h1>
        <p className="text-muted-foreground">
          Components, colors, and typography for the Unified Life Orchestration Platform
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-[#6366f1]" />
          <h2 className="text-2xl font-bold">Color Palette</h2>
          <Badge variant="outline" className="ml-2">Click any swatch to copy hex</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {brandColors.map((color) => {
                const isCopied = copiedColor === color.hex;
                return (
                  <div
                    key={color.hex}
                    className="space-y-2 group cursor-pointer"
                    onClick={() => copyColor(color.hex)}
                    title={`Click to copy ${color.hex}`}
                  >
                    <div
                      className="w-full h-24 rounded-lg relative overflow-hidden transition-transform group-hover:scale-105 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                        isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        {isCopied
                          ? <Check className="w-6 h-6 text-white drop-shadow" />
                          : <Copy className="w-5 h-5 text-white drop-shadow" />}
                      </div>
                    </div>
                    <p className="text-sm font-medium">{color.name}</p>
                    <div className="flex items-center gap-1">
                      <code className="text-xs text-muted-foreground flex-1">{color.hex}</code>
                      {isCopied && <Badge className="text-[10px] py-0 px-1 bg-[#10b981]" >Copied!</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gradients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Primary Gradient", from: "#6366f1", to: "#a855f7" },
                { label: "Success Gradient", from: "#10b981", to: "#3b82f6" },
                { label: "Warning Gradient", from: "#f59e0b", to: "#f97316" },
              ].map((g) => (
                <div key={g.label} className="space-y-2 cursor-pointer group"
                  onClick={() => copyColor(`linear-gradient(to right, ${g.from}, ${g.to})`)}>
                  <div
                    className="w-full h-24 rounded-lg group-hover:scale-105 transition-transform shadow-sm"
                    style={{ background: `linear-gradient(to right, ${g.from}, ${g.to})` }}
                  />
                  <p className="text-sm font-medium">{g.label}</p>
                  <code className="text-xs text-muted-foreground">{g.from} → {g.to}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Custom Color Picker */}
        <Card className="border-2 border-[#6366f1]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#6366f1]" />
              Custom Color Builder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                className="w-32 h-32 rounded-2xl shadow-lg flex-shrink-0 border border-border transition-all"
                style={{ backgroundColor: customColor }}
              />
              <div className="space-y-4 flex-1 w-full">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium w-16">Pick Color</label>
                  <input
                    type="color"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                  />
                  <Input
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    className="font-mono w-36"
                    maxLength={7}
                    placeholder="#6366f1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyColor(customColor)}
                    className="gap-2"
                  >
                    {copiedColor === customColor ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                    {copiedColor === customColor ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["10", "20", "30", "50", "70", "80", "90", "100"].map(op => (
                    <div
                      key={op}
                      title={`${op}% opacity`}
                      className="h-8 rounded cursor-pointer border border-border hover:scale-105 transition-transform"
                      style={{ backgroundColor: customColor, opacity: parseInt(op) / 100 }}
                      onClick={() => copyColor(customColor)}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">↑ Opacity variants — click to copy the base hex</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-6 h-6 text-[#6366f1]" />
          <h2 className="text-2xl font-bold">Typography</h2>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h1>Heading 1 - Main Page Titles</h1>
              <code className="text-xs text-muted-foreground">text-3xl font-bold</code>
            </div>
            <div>
              <h2>Heading 2 - Section Titles</h2>
              <code className="text-xs text-muted-foreground">text-2xl font-bold</code>
            </div>
            <div>
              <h3>Heading 3 - Card Titles</h3>
              <code className="text-xs text-muted-foreground">text-xl font-bold</code>
            </div>
            <div>
              <h4>Heading 4 - Subsections</h4>
              <code className="text-xs text-muted-foreground">text-lg font-medium</code>
            </div>
            <div>
              <p>Body text - Regular paragraphs and content</p>
              <code className="text-xs text-muted-foreground">text-base</code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Small text - Secondary information</p>
              <code className="text-xs text-muted-foreground">text-sm text-muted-foreground</code>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#6366f1]" />
          <h2 className="text-2xl font-bold">Buttons</h2>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h4>Variants</h4>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-[#6366f1] hover:bg-[#6366f1]/90">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4>Sizes</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">📌</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Form Elements */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layout className="w-6 h-6 text-[#6366f1]" />
          <h2 className="text-2xl font-bold">Form Elements</h2>
        </div>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h4>Input Fields</h4>
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
            </div>

            <div className="space-y-2">
              <h4>Switch</h4>
              <div className="flex items-center gap-4">
                <Switch />
                <Switch checked />
              </div>
            </div>

            <div className="space-y-2">
              <h4>Slider</h4>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>

            <div className="space-y-2">
              <h4>Progress</h4>
              <Progress value={65} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges & Avatars */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Badges & Avatars</h2>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <h4>Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-[#6366f1]">Custom</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4>Avatars</h4>
              <div className="flex gap-2">
                <Avatar>
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <Avatar className="bg-[#6366f1]">
                  <AvatarFallback className="text-white">SJ</AvatarFallback>
                </Avatar>
                <Avatar className="bg-gradient-to-br from-[#6366f1] to-[#a855f7]">
                  <AvatarFallback className="text-white">MC</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Card Styles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Standard card with subtle border and rounded corners.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#6366f1]/20 bg-gradient-to-r from-[#6366f1]/5 to-transparent">
            <CardHeader>
              <CardTitle>Accent Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Highlighted card with gradient background.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#10b981]/20 shadow-lg">
            <CardHeader>
              <CardTitle>Success Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card with custom border for important content.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Spacing & Layout */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Spacing & Layout</h2>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h4 className="mb-2">Padding Scale</h4>
              <div className="space-y-2">
                <div className="p-2 bg-accent rounded">p-2 (0.5rem)</div>
                <div className="p-4 bg-accent rounded">p-4 (1rem)</div>
                <div className="p-6 bg-accent rounded">p-6 (1.5rem)</div>
                <div className="p-8 bg-accent rounded">p-8 (2rem)</div>
              </div>
            </div>

            <div>
              <h4 className="mb-2">Border Radius</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-16 bg-accent rounded">rounded</div>
                <div className="h-16 bg-accent rounded-lg">rounded-lg</div>
                <div className="h-16 bg-accent rounded-xl">rounded-xl</div>
                <div className="h-16 bg-accent rounded-full">rounded-full</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
