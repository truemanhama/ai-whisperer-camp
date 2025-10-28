import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface QuickQuizProps {
  onComplete: (score: number) => void;
}

const QuickQuiz = ({ onComplete }: QuickQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      question: "What is data?",
      options: [
        "Only numbers and statistics",
        "Information collected and stored for analysis",
        "Just computer code",
        "Random facts"
      ],
      correct: 1,
      explanation: "Data is information that can be collected, stored, and analyzed to help us understand patterns and make decisions."
    },
    {
      question: "Why do we collect data?",
      options: [
        "To make our devices heavier",
        "To confuse people",
        "To understand patterns and make informed decisions",
        "Because it's required by law"
      ],
      correct: 2,
      explanation: "We collect data to identify patterns, trends, and insights that help us make better decisions and predictions."
    },
    {
      question: "Which of these is an example of data?",
      options: [
        "A random thought",
        "Your daily screen time measurements",
        "A dream you had",
        "An opinion without evidence"
      ],
      correct: 1,
      explanation: "Screen time measurements are quantifiable data that can be tracked and analyzed over time."
    },
    {
      question: "What can data help AI systems do?",
      options: [
        "Think like humans",
        "Have emotions",
        "Learn patterns and make predictions",
        "Become conscious"
      ],
      correct: 2,
      explanation: "AI uses data to identify patterns and make predictions, but it doesn't think, feel, or become conscious like humans."
    }
  ];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete(score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0));
    }
  };

  const isCorrect = selectedAnswer === questions[currentQuestion].correct;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Quick Quiz: Understanding Data</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Score:</span>
            <span className="text-xl font-bold text-primary">{score}/{questions.length}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <Card className="p-6 bg-gradient-subtle">
          <p className="text-lg font-medium mb-4">{questions[currentQuestion].question}</p>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? (isCorrect ? "default" : "destructive") : "outline"}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => !showFeedback && handleAnswer(index)}
                disabled={showFeedback}
              >
                <span className="flex items-center gap-2">
                  {showFeedback && index === questions[currentQuestion].correct && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {showFeedback && selectedAnswer === index && !isCorrect && (
                    <XCircle className="h-4 w-4" />
                  )}
                  {option}
                </span>
              </Button>
            ))}
          </div>
        </Card>

        {showFeedback && (
          <Card className={`p-4 animate-scale-in ${isCorrect ? "bg-primary/10 border-primary/20" : "bg-destructive/10 border-destructive/20"}`}>
            <div className="flex items-start gap-2">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {isCorrect ? "Correct!" : "Not quite right"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            </div>
          </Card>
        )}

        {showFeedback && (
          <Button onClick={handleNext} className="w-full shadow-glow">
            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickQuiz;
