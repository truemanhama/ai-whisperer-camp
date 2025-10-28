import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface AIPredictionProps {
  onComplete: (predictions: any[]) => void;
}

const AIPrediction = ({ onComplete }: AIPredictionProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userPrediction, setUserPrediction] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);

  const questions = [
    {
      prompt: "What's the capital of France?",
      aiAnswer: "The capital of France is Paris.",
      type: "factual"
    },
    {
      prompt: "Write a haiku about the moon.",
      aiAnswer: "Silver orb above\nCasting gentle light below\nNight's eternal friend",
      type: "creative"
    },
    {
      prompt: "Explain photosynthesis in one sentence.",
      aiAnswer: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
      type: "explanatory"
    }
  ];

  const handlePredict = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    const newPrediction = {
      question: questions[currentQuestion].prompt,
      userAnswer: userPrediction,
      aiAnswer: questions[currentQuestion].aiAnswer
    };
    setPredictions([...predictions, newPrediction]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserPrediction("");
      setShowAnswer(false);
    } else {
      onComplete([...predictions, newPrediction]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">AI Prediction Challenge</h3>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <p className="text-muted-foreground">
          Try to predict how an AI would respond to this question:
        </p>

        <Card className="p-6 bg-gradient-subtle">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-1" />
            <p className="text-lg font-medium">{questions[currentQuestion].prompt}</p>
          </div>
        </Card>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Prediction:</label>
          <Textarea
            placeholder="Type how you think AI would respond..."
            value={userPrediction}
            onChange={(e) => setUserPrediction(e.target.value)}
            disabled={showAnswer}
            rows={4}
            className="resize-none"
          />
        </div>

        {showAnswer && (
          <Card className="p-6 bg-primary/10 border-primary/20 animate-scale-in">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> AI Response:
            </h4>
            <p className="text-muted-foreground">{questions[currentQuestion].aiAnswer}</p>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">How close was your prediction?</p>
              <div className="flex gap-2">
                {["😕 Not close", "🤔 Somewhat", "😊 Very close", "🎯 Spot on!"].map((emoji) => (
                  <Button
                    key={emoji}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={handleNext}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {!showAnswer && (
          <Button
            onClick={handlePredict}
            disabled={!userPrediction.trim()}
            className="w-full shadow-glow"
          >
            See AI Response
          </Button>
        )}
      </div>
    </div>
  );
};

export default AIPrediction;
