import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import QuizCard, { QuizQuestion } from "@/components/QuizCard";
import { updateActivityScore } from "@/lib/progressStore";
import { 
  logActivityStart, 
  logActivityInteraction, 
  logActivityCompletion 
} from "@/lib/firebaseService";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const Myths = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [activitySessionId, setActivitySessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, isRegistered, sessionId } = useUser();

  // Redirect if not logged in (additional safeguard)
  if (!isRegistered || !user) {
    return null; // ProtectedRoute will handle redirect
  }

  // Log activity start when component mounts
  useEffect(() => {
    const startActivity = async () => {
      if (sessionId && !activitySessionId) {
        try {
          const sessionId_doc = await logActivityStart(sessionId, "myths-quiz");
          setActivitySessionId(sessionId_doc);
        } catch (error) {
          console.error("Error starting activity session:", error);
        }
      }
    };
    startActivity();
  }, [sessionId, activitySessionId]);

  const questions: QuizQuestion[] = [
    {
      id: "1",
      question: "AI can think and feel emotions just like humans do.",
      options: ["True - AI has emotions", "False - AI doesn't have emotions"],
      correctAnswer: 1,
      explanation:
        "False! AI doesn't have feelings or consciousness. It processes data and follows algorithms, but it doesn't experience emotions like happiness, sadness, or fear.",
    },
    {
      id: "2",
      question: "AI will eventually take over the world and control humans.",
      options: ["True - AI will become our overlords", "False - This is science fiction"],
      correctAnswer: 1,
      explanation:
        "False! This is a common movie trope but not reality. AI is a tool created and controlled by humans. It doesn't have goals, desires, or the ability to 'take over', it only does what it's programmed to do.",
    },
    {
      id: "3",
      question: "AI is always 100% accurate and never makes mistakes.",
      options: ["True - AI is perfect", "False - AI can make errors"],
      correctAnswer: 1,
      explanation:
        "False! AI can and does make mistakes. Its accuracy depends on the quality of its training data, the algorithm design, and how well it generalizes to new situations. AI can be biased or fail in unexpected ways.",
    },
    {
      id: "4",
      question: "AI needs large amounts of data to learn effectively.",
      options: ["True - More data is better", "False - AI doesn't need much data"],
      correctAnswer: 0,
      explanation:
        "True! Most AI systems require thousands or even millions of examples to learn patterns accurately. The quality and diversity of that data are crucial for good performance.",
    },
    {
      id: "5",
      question: "Only tech experts and programmers can use AI tools.",
      options: ["True - You need coding skills", "False - Anyone can use AI"],
      correctAnswer: 1,
      explanation:
        "False! While creating AI systems requires technical knowledge, many AI tools are designed for everyone to use, like voice assistants, photo apps, and chatbots. You don't need to be a programmer to benefit from AI!",
    },
    {
      id: "6",
      question: "AI can be biased based on the data it's trained on.",
      options: ["True - AI can learn biases", "False - AI is always fair"],
      correctAnswer: 0,
      explanation:
        "True! If an AI is trained on biased data, it will learn and replicate those biases. For example, if training data mostly shows doctors as men, the AI might incorrectly associate 'doctor' with 'male.' This is why diverse, representative data is so important.",
    },
  ];

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (correct: boolean) => {
    const question = questions[currentIndex];
    const pointsPerQuestion = Math.round(100 / questions.length);
    const newScore = correct ? score + pointsPerQuestion : score;
    
    // Log the answer interaction
    if (activitySessionId) {
      await logActivityInteraction(activitySessionId, {
        type: "answer",
        data: {
          questionId: question.id,
          question: question.question,
          isCorrect: correct,
          score: newScore,
          questionIndex: currentIndex,
        },
      });
    }

    if (correct) {
      setScore(newScore);
    }

    setTimeout(async () => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const finalScore = correct ? newScore : score;
        setGameComplete(true);
        await updateActivityScore("myths-quiz", finalScore);
        
        // Log completion
        if (activitySessionId) {
          await logActivityCompletion(activitySessionId, finalScore, {
            totalQuestions: questions.length,
            correctAnswers: Math.floor(finalScore / pointsPerQuestion),
          });
        }
        
        toast({
          title: "Quiz Complete! 🎉",
          description: `You scored ${finalScore} out of 100 points!`,
        });
      }
    }, 2500);
  };

  const resetQuiz = async () => {
    setCurrentIndex(0);
    setScore(0);
    setGameComplete(false);
    
    // Start a new activity session
    if (sessionId) {
      try {
        const sessionId_doc = await logActivityStart(sessionId, "myths-quiz");
        setActivitySessionId(sessionId_doc);
      } catch (error) {
        console.error("Error starting new activity session:", error);
      }
    }
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <Card className="max-w-2xl mx-auto shadow-elevated text-center animate-bounce-in">
            <CardContent className="pt-12 pb-8 space-y-6">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-3xl font-bold">Quiz Complete!</h2>
              <p className="text-lg text-muted-foreground">You've debunked the AI myths</p>
              <div className="text-5xl font-bold text-primary">{score} / 100</div>
              <p className="text-sm text-muted-foreground">
                {score === 100
                  ? "Perfect! You're a myth-busting champion! 🏆"
                  : score >= 80
                  ? "Great job! You know your AI facts! 🌟"
                  : score >= 60
                  ? "Good work! Review the lessons to improve! 📚"
                  : "Keep learning! Understanding AI takes practice! 💪"}
              </p>
              <Button onClick={resetQuiz} size="lg" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Retake Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              AI <span className="bg-gradient-hero bg-clip-text text-transparent">Myths & Truths</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Test your knowledge and separate fact from fiction
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </div>
            <div className="text-2xl font-bold text-primary">Score: {score}</div>
          </div>

          {/* Quiz Card */}
          <QuizCard question={currentQuestion} onAnswer={handleAnswer} />

          {/* Info Card */}
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Why This Matters 🎯</h3>
              <p className="text-sm text-muted-foreground">
                Understanding what AI can and can't do helps us use it responsibly and avoid falling 
                for misconceptions. Many fears about AI come from science fiction rather than reality!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Myths;
