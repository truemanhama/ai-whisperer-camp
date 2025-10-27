import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { updateActivityScore } from "@/lib/progressStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageChallenge {
  id: number;
  url: string;
  isAI: boolean;
  explanation: string;
}

const RealOrAI = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const { toast } = useToast();

  // Sample challenges (in real app, these would be actual image URLs)
  const challenges: ImageChallenge[] = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      isAI: false,
      explanation: "This is a real photograph. Notice the natural lighting, realistic textures, and authentic mountain landscape details.",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
      isAI: true,
      explanation: "This was AI-generated. Look closely at the gradient patterns and slightly artificial color transitions that are common in AI art.",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      isAI: false,
      explanation: "Real photo! The natural wave motion, foam texture, and authentic beach environment are captured by a camera.",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
      isAI: true,
      explanation: "AI-generated. The fur texture has some inconsistencies and the eyes have that characteristic 'too perfect' quality of AI images.",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      isAI: false,
      explanation: "This is a real landscape photo with authentic atmospheric perspective and natural light distribution.",
    },
  ];

  const currentChallenge = challenges[currentIndex];

  const handleAnswer = (answer: boolean) => {
    if (answered) return;

    setSelectedAnswer(answer);
    setAnswered(true);

    const isCorrect = answer === currentChallenge.isAI;
    if (isCorrect) {
      setScore(score + 20);
    }

    setTimeout(() => {
      if (currentIndex < challenges.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameComplete(true);
        const finalScore = isCorrect ? score + 20 : score;
        updateActivityScore("real-or-ai", finalScore);
        toast({
          title: "Activity Complete! 🎉",
          description: `You scored ${finalScore} out of ${challenges.length * 20} points!`,
        });
      }
    }, 3000);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameComplete(false);
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12">
          <Card className="max-w-2xl mx-auto shadow-elevated text-center animate-bounce-in">
            <CardContent className="pt-12 pb-8 space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold">Great Job!</h2>
              <p className="text-lg text-muted-foreground">
                You completed the "Real or AI?" challenge
              </p>
              <div className="text-5xl font-bold text-primary">
                {score} / {challenges.length * 20}
              </div>
              <p className="text-sm text-muted-foreground">
                {score === challenges.length * 20
                  ? "Perfect score! You're an AI detection expert! 🏆"
                  : score >= challenges.length * 15
                  ? "Excellent work! You have a great eye for detail! 👏"
                  : score >= challenges.length * 10
                  ? "Good effort! Keep practicing to improve! 💪"
                  : "Keep learning! Every attempt makes you better! 🌟"}
              </p>
              <Button onClick={resetGame} size="lg" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">Real or AI?</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Can you tell which images are real and which were created by AI?
            </p>
          </div>

          {/* Score & Progress */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Image {currentIndex + 1} of {challenges.length}
            </div>
            <div className="text-2xl font-bold text-primary">
              Score: {score}
            </div>
          </div>

          {/* Image Card */}
          <Card className="shadow-elevated animate-fade-in">
            <CardContent className="p-0">
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={currentChallenge.url}
                  alt="Challenge"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 space-y-6">
                {!answered ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleAnswer(false)}
                      className="h-20 text-lg hover:border-success hover:bg-success/10"
                    >
                      📷 Real Photo
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleAnswer(true)}
                      className="h-20 text-lg hover:border-primary hover:bg-primary/10"
                    >
                      🤖 AI Generated
                    </Button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "p-6 rounded-lg animate-slide-up",
                      selectedAnswer === currentChallenge.isAI
                        ? "bg-success/10 border-2 border-success"
                        : "bg-destructive/10 border-2 border-destructive"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {selectedAnswer === currentChallenge.isAI ? (
                        <>
                          <CheckCircle2 className="h-6 w-6 text-success" />
                          <span className="font-bold text-lg">Correct! 🎉</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-6 w-6 text-destructive" />
                          <span className="font-bold text-lg">Not quite! 🤔</span>
                        </>
                      )}
                    </div>
                    <p className="text-muted-foreground">{currentChallenge.explanation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Detection Tips 💡</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Look for unnatural textures or patterns</li>
                <li>• Check if eyes or reflections look "too perfect"</li>
                <li>• Notice if text or small details are garbled</li>
                <li>• AI often struggles with hands, fingers, and complex shadows</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealOrAI;
