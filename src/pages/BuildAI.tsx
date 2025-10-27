import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, Play, CheckCircle2, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import { updateActivityScore, earnBadge } from "@/lib/progressStore";
import { useToast } from "@/hooks/use-toast";

const BuildAI = () => {
  const [step, setStep] = useState<"intro" | "training" | "testing" | "complete">("intro");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const { toast } = useToast();

  const startTraining = () => {
    setStep("training");
    setTrainingProgress(0);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const finalAccuracy = Math.floor(Math.random() * 15) + 80; // 80-95%
            setAccuracy(finalAccuracy);
            setStep("testing");
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const completeActivity = () => {
    setStep("complete");
    updateActivityScore("build-ai", accuracy);
    if (accuracy >= 90) {
      earnBadge("ai-builder");
    }
    toast({
      title: "Activity Complete! 🎉",
      description: `Your AI achieved ${accuracy}% accuracy!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              Build a{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Mini AI</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Experience how machine learning works by training your own image classifier
            </p>
          </div>

          {/* Intro Step */}
          {step === "intro" && (
            <Card className="shadow-elevated animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  How This Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  You're about to train a simplified AI model to recognize the difference between 
                  cats and dogs! This is similar to how real AI systems learn.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">1. Collect Training Data</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll use 1,000 example images of cats and dogs (500 each). More data 
                        helps the AI learn better patterns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">2. Train the Model</h4>
                      <p className="text-sm text-muted-foreground">
                        The AI will analyze the images, learning features like ear shape, fur 
                        patterns, and facial structure that distinguish cats from dogs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">3. Test Accuracy</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll test your AI on new images it hasn't seen before to measure how 
                        well it learned!
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-gradient-card p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-2">💡 Real-World Connection</p>
                  <p className="text-sm text-muted-foreground">
                    This same process is used to train AI for facial recognition, medical 
                    diagnosis, self-driving cars, and more — just with much more data and 
                    computing power!
                  </p>
                </div>

                <Button onClick={startTraining} size="lg" className="w-full gap-2">
                  <Play className="h-5 w-5" />
                  Start Training Your AI
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Training Step */}
          {step === "training" && (
            <Card className="shadow-elevated animate-fade-in">
              <CardHeader>
                <CardTitle>Training in Progress...</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <ProgressBar
                    value={trainingProgress}
                    max={100}
                    label="Training Progress"
                    showPercentage
                  />

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-gradient-card rounded-lg border text-center">
                      <div className="text-3xl font-bold text-primary">1,000</div>
                      <div className="text-sm text-muted-foreground mt-1">Images Processed</div>
                    </div>
                    <div className="p-4 bg-gradient-card rounded-lg border text-center">
                      <div className="text-3xl font-bold text-primary">
                        {Math.floor((trainingProgress / 100) * 50)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Patterns Learned</div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>What's happening:</strong> Your AI is analyzing pixel patterns, 
                    colors, and shapes in each image. It's learning to identify features unique 
                    to cats (like pointed ears and whiskers) versus dogs (like floppy ears and 
                    different nose shapes).
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Testing Step */}
          {step === "testing" && (
            <Card className="shadow-elevated animate-bounce-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  Training Complete!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8 space-y-4">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold">Your AI is Ready!</h3>
                  <p className="text-muted-foreground">
                    We tested it on 200 new images it had never seen before...
                  </p>

                  <div className="inline-block p-8 bg-gradient-hero rounded-2xl shadow-glow">
                    <div className="text-6xl font-bold text-primary-foreground">{accuracy}%</div>
                    <div className="text-sm text-primary-foreground/80 mt-2">Accuracy</div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    {accuracy >= 90
                      ? "Outstanding! Your AI is highly accurate! 🏆"
                      : accuracy >= 80
                      ? "Great work! That's solid performance! 🌟"
                      : "Good start! Real AI often needs more data and tuning. 💪"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">What You Learned:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>AI needs training data to learn patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>More and better data usually leads to higher accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>AI makes predictions based on learned patterns, not understanding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Testing on new data shows how well the AI generalizes</span>
                    </li>
                  </ul>
                </div>

                <Button onClick={completeActivity} size="lg" className="w-full gap-2">
                  Complete Activity <CheckCircle2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <Card className="shadow-elevated animate-fade-in">
              <CardContent className="pt-12 pb-8 text-center space-y-6">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-3xl font-bold">Congratulations!</h2>
                <p className="text-lg text-muted-foreground">
                  You've successfully trained your first AI model!
                </p>
                <div className="text-4xl font-bold text-primary">{accuracy}% Accuracy</div>
                {accuracy >= 90 && (
                  <div className="inline-block px-4 py-2 bg-gradient-hero rounded-full">
                    <span className="text-sm font-semibold text-primary-foreground">
                      🏆 AI Builder Badge Earned!
                    </span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  You now understand the basics of how machine learning works. This same process 
                  is used to create AI systems that power everything from voice assistants to 
                  medical diagnosis tools!
                </p>
                <Button onClick={() => setStep("intro")} variant="outline" className="gap-2">
                  Train Another AI
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildAI;
