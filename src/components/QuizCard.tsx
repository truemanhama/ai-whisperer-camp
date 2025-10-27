import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    const isCorrect = index === question.correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
      setShowFeedback(false);
    }, 2000);
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "w-full justify-start text-left h-auto py-4 px-4 transition-all",
                showCorrect && "border-success bg-success/10",
                showIncorrect && "border-destructive bg-destructive/10",
                !showFeedback && "hover:border-primary hover:bg-primary/5"
              )}
              onClick={() => handleOptionClick(index)}
              disabled={showFeedback}
            >
              <div className="flex items-start gap-3 w-full">
                {showCorrect && <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />}
                {showIncorrect && <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
                <span className="flex-1">{option}</span>
              </div>
            </Button>
          );
        })}
        
        {showFeedback && (
          <div
            className={cn(
              "p-4 rounded-lg animate-slide-up",
              selectedOption === question.correctAnswer
                ? "bg-success/10 border border-success"
                : "bg-warning/10 border border-warning"
            )}
          >
            <p className="text-sm font-medium mb-1">
              {selectedOption === question.correctAnswer ? "Correct! 🎉" : "Not quite! 🤔"}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizCard;
