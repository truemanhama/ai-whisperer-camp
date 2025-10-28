import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ModelingSimulationProps {
  onComplete: (data: any) => void;
}

const ModelingSimulation = ({ onComplete }: ModelingSimulationProps) => {
  const [temperature, setTemperature] = useState(50);
  const [co2Level, setCo2Level] = useState(50);
  const [deforestation, setDeforestation] = useState(50);
  const [reflection, setReflection] = useState("");
  const [showReflection, setShowReflection] = useState(false);

  // Simple calculation for impact score
  const calculateImpact = () => {
    return Math.round((temperature * 0.4 + co2Level * 0.35 + deforestation * 0.25));
  };

  // Generate chart data based on current values
  const generateChartData = () => {
    const impact = calculateImpact();
    return Array.from({ length: 10 }, (_, i) => ({
      year: 2020 + i,
      impact: Math.max(0, Math.min(100, impact + (Math.random() - 0.5) * 10 + i * 2))
    }));
  };

  const chartData = generateChartData();

  const handleContinue = () => {
    if (!showReflection) {
      setShowReflection(true);
    } else {
      onComplete({ temperature, co2Level, deforestation, reflection, impact: calculateImpact() });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Climate Impact Model</h3>
        <p className="text-muted-foreground">
          Adjust the variables below to see how they might affect environmental impact predictions.
          This is a simplified model for learning purposes.
        </p>

        {/* Sliders */}
        <Card className="p-6 space-y-6 bg-secondary/20">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Temperature Increase (°C)</label>
              <span className="text-sm text-muted-foreground">{(temperature / 10).toFixed(1)}°C</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">CO₂ Levels (ppm)</label>
              <span className="text-sm text-muted-foreground">{300 + co2Level * 2} ppm</span>
            </div>
            <Slider
              value={[co2Level]}
              onValueChange={(value) => setCo2Level(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Deforestation Rate (%)</label>
              <span className="text-sm text-muted-foreground">{deforestation}%</span>
            </div>
            <Slider
              value={[deforestation]}
              onValueChange={(value) => setDeforestation(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </Card>

        {/* Impact Score */}
        <Card className="p-6 bg-gradient-subtle">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Predicted Impact Score</h4>
            <div className="text-3xl font-bold text-primary">
              {calculateImpact()}
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="impact"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {showReflection && (
          <Card className="p-6 bg-secondary/20 animate-scale-in">
            <h4 className="font-semibold mb-3">Critical Thinking:</h4>
            <p className="text-sm text-muted-foreground mb-4">
              What assumptions might affect this model? Consider: data sources, time scales, 
              interactions between variables, and other factors not included in this simple model.
            </p>
            <Textarea
              placeholder="Share your thoughts on the model's limitations..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
            />
          </Card>
        )}

        <Button
          onClick={handleContinue}
          disabled={showReflection && !reflection.trim()}
          className="w-full shadow-glow"
        >
          {showReflection ? "Continue" : "Reflect on This Model"}
        </Button>
      </div>
    </div>
  );
};

export default ModelingSimulation;
