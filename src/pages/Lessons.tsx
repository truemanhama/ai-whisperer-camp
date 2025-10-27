import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, BookOpen, Lightbulb, Database, Cpu, Users, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { markLessonComplete } from "@/lib/progressStore";
import { useToast } from "@/hooks/use-toast";

const Lessons = () => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { toast } = useToast();

  const handleCompleteSection = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      markLessonComplete(sectionId);
      toast({
        title: "Section Complete! 🎉",
        description: "Great job! Keep learning.",
      });
    }
  };

  const lessonSections = [
    {
      id: "what-is-ai",
      icon: Lightbulb,
      title: "What is Artificial Intelligence?",
      content: (
        <>
          <p className="mb-4">
            <strong>Artificial Intelligence (AI)</strong> is the simulation of human intelligence by machines. 
            It's about creating computer systems that can perform tasks that typically require human intelligence, 
            such as recognizing speech, making decisions, and identifying patterns.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <p className="text-sm">
              <strong>💡 Simple Definition:</strong> AI is when machines can learn, think, and make decisions 
              similar to how humans do — but they do it using data and algorithms instead of a brain!
            </p>
          </div>
          <p>
            AI is NOT magic, and it's NOT like the robots in science fiction movies that have feelings. 
            Instead, it's a powerful tool that learns from data and follows patterns.
          </p>
        </>
      ),
    },
    {
      id: "how-ai-works",
      icon: Cpu,
      title: "How Does AI Work?",
      content: (
        <>
          <p className="mb-4">
            AI works by learning from <strong>data</strong>. Think of it like teaching a child — 
            the more examples they see, the better they get at recognizing things.
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">1. Data Collection</h4>
                <p className="text-sm text-muted-foreground">
                  AI needs lots of examples (data) to learn from — like thousands of pictures, 
                  text messages, or sounds.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">2. Training</h4>
                <p className="text-sm text-muted-foreground">
                  The AI analyzes the data to find patterns. For example, learning what features 
                  make a cat look different from a dog.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">3. Prediction</h4>
                <p className="text-sm text-muted-foreground">
                  Once trained, the AI can make predictions on new data it hasn't seen before — 
                  like identifying a new cat photo!
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "key-concepts",
      icon: BookOpen,
      title: "Key AI Concepts",
      content: (
        <>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-primary">Machine Learning (ML)</h4>
              <p className="text-sm text-muted-foreground">
                A type of AI where systems learn from data without being explicitly programmed for every task. 
                Think of it as teaching a computer to recognize patterns by showing it examples.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 text-primary">Neural Networks</h4>
              <p className="text-sm text-muted-foreground">
                Inspired by how the human brain works, these are systems of interconnected "neurons" 
                (actually just math!) that process information in layers to recognize complex patterns.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 text-primary">Training Data</h4>
              <p className="text-sm text-muted-foreground">
                The examples used to teach an AI system. The quality and quantity of training data 
                directly affects how well the AI performs.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2 text-primary">Algorithm</h4>
              <p className="text-sm text-muted-foreground">
                A set of step-by-step instructions that tells the computer how to process data 
                and make decisions. It's like a recipe for the AI to follow.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "ai-bias",
      icon: AlertCircle,
      title: "Understanding AI Bias",
      content: (
        <>
          <p className="mb-4">
            AI systems can have <strong>bias</strong> — meaning they might make unfair or inaccurate decisions 
            based on the data they were trained on.
          </p>
          <div className="bg-warning/10 border border-warning p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Why does this happen?
            </h4>
            <ul className="text-sm space-y-2 ml-6 list-disc">
              <li>If training data contains biased examples, the AI will learn those biases</li>
              <li>If data doesn't represent all groups fairly, the AI won't work well for everyone</li>
              <li>Human assumptions can accidentally be built into how the AI is designed</li>
            </ul>
          </div>
          <p className="text-sm">
            <strong>Example:</strong> If an AI is trained mostly on photos of light-skinned faces, 
            it might not recognize darker-skinned faces as accurately. That's why diverse, representative 
            data is so important!
          </p>
        </>
      ),
    },
    {
      id: "real-world-ai",
      icon: Users,
      title: "AI in the Real World",
      content: (
        <>
          <p className="mb-4">
            You probably use AI every day without even realizing it! Here are some common examples:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gradient-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">🎵 Music & Videos</h4>
              <p className="text-sm text-muted-foreground">
                Spotify and YouTube use AI to recommend songs and videos based on what you like.
              </p>
            </div>
            <div className="bg-gradient-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">📱 Virtual Assistants</h4>
              <p className="text-sm text-muted-foreground">
                Siri, Alexa, and Google Assistant use AI to understand your voice and respond to questions.
              </p>
            </div>
            <div className="bg-gradient-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">📸 Photo Filters</h4>
              <p className="text-sm text-muted-foreground">
                Snapchat and Instagram filters use AI to detect faces and add fun effects.
              </p>
            </div>
            <div className="bg-gradient-card p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">🎮 Gaming</h4>
              <p className="text-sm text-muted-foreground">
                Video game characters use AI to act smarter and more realistic during gameplay.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              AI <span className="bg-gradient-hero bg-clip-text text-transparent">Basics</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn the fundamentals of artificial intelligence in plain English
            </p>
          </div>

          {/* Lesson Sections */}
          {lessonSections.map((section, index) => {
            const Icon = section.icon;
            const isCompleted = completedSections.includes(section.id);

            return (
              <Card
                key={section.id}
                className="shadow-card hover:shadow-elevated transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-hero shadow-glow">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="flex-1">{section.title}</span>
                    {isCompleted && (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </div>
                  {!isCompleted && (
                    <Button
                      onClick={() => handleCompleteSection(section.id)}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Mark as Complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Completion Progress */}
          <Card className="shadow-card bg-gradient-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold mb-1">Lesson Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {completedSections.length} of {lessonSections.length} sections complete
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round((completedSections.length / lessonSections.length) * 100)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Lessons;
