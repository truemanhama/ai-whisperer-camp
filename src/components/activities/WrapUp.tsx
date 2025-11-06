import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Award, Download } from "lucide-react";

interface WrapUpProps {
  moduleData: any;
  onComplete?: () => void;
}

const WrapUp = ({ moduleData, onComplete }: WrapUpProps) => {
  const [reflections, setReflections] = useState({
    intelligence: "",
    aiData: "",
    digitalFootprint: ""
  });

  const questions = [
    {
      key: "intelligence",
      question: "How do you define intelligence now, after completing this module?",
      prompt: "Think about the word cloud activity and what you learned..."
    },
    {
      key: "aiData",
      question: "How does AI use data to make predictions?",
      prompt: "Consider the prediction game and modeling simulation..."
    },
    {
      key: "digitalFootprint",
      question: "What data about you exists online, and how do you feel about it?",
      prompt: "Reflect on the data sharing map activity..."
    }
  ];

  const handleReflectionChange = (key: string, value: string) => {
    setReflections({ ...reflections, [key]: value });
  };

  const allComplete = Object.values(reflections).every(r => r.trim().length > 0);

  const handleDownload = () => {
    const summary = `
EXPLORING AI AND DATA - MODULE SUMMARY
=====================================

YOUR REFLECTIONS:

1. How do you define intelligence now?
${reflections.intelligence}

2. How does AI use data to make predictions?
${reflections.aiData}

3. What data about you exists online?
${reflections.digitalFootprint}

MODULE ACTIVITIES COMPLETED:
- Word Cloud: Intelligence concepts
- Questions Only Game
- AI Prediction Challenge  
- Data Sharing Map
- Quick Quiz on Data
- Data Type Sorting
- Climate Modeling Simulation

Congratulations on completing the "Exploring AI and Data" module!
Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-data-module-summary.txt";
    a.click();
    URL.revokeObjectURL(url);
    
    // Call onComplete when download is triggered (module fully complete)
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-2xl font-bold">Congratulations!</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You've completed the "Exploring AI and Data" module. Take a moment to reflect 
          on what you've learned and how your understanding has evolved.
        </p>
      </div>

      {/* Reflection Questions */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <Card key={q.key} className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{q.question}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{q.prompt}</p>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={reflections[q.key as keyof typeof reflections]}
                    onChange={(e) => handleReflectionChange(q.key, e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Completion Card */}
      {allComplete && (
        <Card className="p-8 bg-gradient-subtle text-center animate-scale-in">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <h4 className="text-xl font-bold mb-2">Module Complete! 🎉</h4>
          <p className="text-muted-foreground mb-6">
            You've successfully explored the fundamentals of AI and data. Your reflections 
            show thoughtful engagement with these important topics.
          </p>
          <Button onClick={handleDownload} size="lg" className="shadow-glow">
            <Download className="mr-2 h-5 w-5" />
            Download Your Summary
          </Button>
        </Card>
      )}

      {!allComplete && (
        <p className="text-center text-sm text-muted-foreground">
          Complete all reflections to download your summary
        </p>
      )}
    </div>
  );
};

export default WrapUp;
