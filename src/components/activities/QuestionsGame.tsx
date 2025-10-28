import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface QuestionsGameProps {
  onComplete: (streak: number) => void;
}

const QuestionsGame = ({ onComplete }: QuestionsGameProps) => {
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  const rounds = [
    {
      context: "Let's talk about your favorite hobbies.",
      options: [
        { text: "What do you like to do in your free time?", isQuestion: true },
        { text: "I enjoy playing video games.", isQuestion: false },
        { text: "How often do you practice your hobbies?", isQuestion: true },
        { text: "Sports are fun to watch.", isQuestion: false }
      ]
    },
    {
      context: "Tell me about your school experience.",
      options: [
        { text: "Math class is challenging.", isQuestion: false },
        { text: "Which subject do you find most interesting?", isQuestion: true },
        { text: "What's your favorite part of the school day?", isQuestion: true },
        { text: "I like science experiments.", isQuestion: false }
      ]
    },
    {
      context: "Let's discuss future plans.",
      options: [
        { text: "Where do you see yourself in five years?", isQuestion: true },
        { text: "College applications are stressful.", isQuestion: false },
        { text: "What career path interests you most?", isQuestion: true },
        { text: "Technology jobs pay well.", isQuestion: false }
      ]
    }
  ];

  const handleChoice = (isQuestion: boolean) => {
    if (isQuestion) {
      setStreak(streak + 1);
      if (currentRound < rounds.length - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        setGameOver(true);
      }
    } else {
      setGameOver(true);
    }
  };

  const handleComplete = () => {
    onComplete(streak);
  };

  if (gameOver) {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold">Game Over!</h3>
        <p className="text-lg">Your streak: <span className="text-primary font-bold">{streak}</span></p>
        <p className="text-muted-foreground max-w-md mx-auto">
          Great job! Asking questions is a key part of intelligent conversation. 
          It shows curiosity and engagement.
        </p>
        <Button onClick={handleComplete} className="shadow-glow">
          Continue to Next Activity
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Questions Only Game</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Streak:</span>
            <span className="text-2xl font-bold text-primary">{streak}</span>
          </div>
        </div>

        <p className="text-muted-foreground">
          Keep the conversation going by only choosing questions! Pick a statement and the game ends.
        </p>

        <Card className="p-6 bg-secondary/20">
          <p className="text-lg italic">"{rounds[currentRound].context}"</p>
        </Card>

        <div className="grid gap-3">
          {rounds[currentRound].options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto py-4 text-left justify-start hover:shadow-glow transition-all"
              onClick={() => handleChoice(option.isQuestion)}
            >
              <span className="text-base">{option.text}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsGame;
