import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lightbulb, Brain, AlertCircle, Sparkles, MapPin, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { markLessonComplete, getProgress } from "@/lib/progressStore";
import { useToast } from "@/hooks/use-toast";

// Define lesson sections outside component to avoid dependency issues
const lessonSections = [
  {
    id: "what-is-ai",
    icon: Lightbulb,
    title: "What is AI?",
    content: (
      <>
        <p className="mb-4 text-base leading-relaxed">
          Imagine you have a super-helpful robot friend who can learn things, remember them, and make smart decisions — almost like a human! That's what <strong>Artificial Intelligence (AI)</strong> is — a way of making computers and machines think and learn like us.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          AI isn't magic; it's when machines are trained to notice patterns and use them to do tasks like chatting, playing music, or recommending YouTube videos. Think of how Netflix suggests what to watch next or how your phone's camera identifies your face — that's AI at work!
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg mb-4 border border-primary/20">
          <p className="text-sm">
            <strong>💡 Remember:</strong> AI doesn't have feelings or creativity like humans. It follows what it's taught, but it can learn from examples and get better over time — just like you get better at cricket after practice.
          </p>
        </div>
        <p className="text-base leading-relaxed font-semibold text-primary">
          So, in short: <strong>AI = machines that learn, think, and make smart choices to help us in everyday life.</strong>
        </p>
      </>
    ),
  },
  {
    id: "how-ai-works",
    icon: Brain,
    title: "How Does AI Work?",
    content: (
      <>
        <p className="mb-4 text-base leading-relaxed">
          Let's say you're learning to recognise fruits. At first, someone shows you many apples and bananas. You notice that apples are round and red, and bananas are long and yellow. Soon, you can tell them apart even without help.
        </p>
        <p className="mb-4 text-base leading-relaxed">
          AI works the same way! It learns from <strong>examples (data)</strong> — thousands or even millions of them. For instance, if we want an AI to recognise cats, we show it tons of cat photos. Over time, it learns what makes a cat look like a cat.
        </p>
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20 p-4 rounded-lg mb-4 border border-primary/20">
          <p className="text-sm mb-2">
            <strong>🧠 Key Point:</strong> It doesn't "understand" like humans do, but it gets really good at spotting patterns. The more examples it sees, the smarter it becomes.
          </p>
          <p className="text-sm">
            Think of it like a cricket player improving by watching replays — the more it sees, the better it predicts what's coming next. That's how AI learns — through <strong>practice, repetition, and feedback</strong>!
          </p>
        </div>
      </>
    ),
  },
  {
    id: "ai-bias",
    icon: AlertCircle,
    title: "Things to Be Mindful Of (AI Bias)",
    content: (
      <>
        <p className="mb-4 text-base leading-relaxed">
          AI learns from the data we give it — so if the data is unfair or one-sided, the AI's decisions can also be unfair. This is called <strong>bias</strong>.
        </p>
        <div className="bg-warning/10 border-2 border-warning/30 p-4 rounded-lg mb-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-warning">
            <AlertCircle className="h-5 w-5" />
            Example of Bias
          </h4>
          <p className="text-sm mb-2">
            Imagine your school's "AI prefect" only learned from pictures of tall students wearing glasses. If a short student without glasses walks in, the AI might not recognise them as a prefect — not because it's mean, but because it never learned about other types!
          </p>
        </div>
        <p className="mb-4 text-base leading-relaxed">
          That's why humans must check and guide AI — just like a teacher corrects your homework when you make mistakes.
        </p>
        <div className="bg-success/10 border border-success/30 p-4 rounded-lg">
          <p className="text-sm">
            <strong>✅ The Solution:</strong> AI bias reminds us to <strong>teach AI fairly</strong>, using data that includes all kinds of people, languages, and situations. It's like ensuring your cricket coach watches <em>every</em> player — not just the top scorers.
          </p>
          <p className="text-sm mt-2">
            When we use AI responsibly, it becomes fairer, kinder, and more helpful to everyone.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "how-to-use-ai",
    icon: Sparkles,
    title: "How and Where to Use AI",
    content: (
      <>
        <p className="mb-4 text-base leading-relaxed">
          AI is like a super assistant — powerful when used wisely. You can use it to <strong>learn faster</strong>, <strong>save time</strong>, or <strong>get creative ideas</strong>. For example:
        </p>
        <ul className="space-y-2 mb-4 list-disc list-inside text-base">
          <li>Use AI chatbots to summarise chapters or explain tough concepts.</li>
          <li>Use AI tools to create fun art, write stories, or design projects.</li>
          <li>Use translation apps to understand new languages.</li>
        </ul>
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 p-4 rounded-lg mb-4 border border-primary/20">
          <p className="text-sm font-semibold mb-2">
            🎯 The Golden Rule:
          </p>
          <p className="text-sm mb-2">
            <strong>Don't let AI think for you — let it think <em>with</em> you.</strong>
          </p>
          <p className="text-sm">
            Always double-check what it says, just like you'd check your friend's homework before copying it. AI can sometimes make confident mistakes, so your own judgment is super important.
          </p>
        </div>
        <p className="text-base leading-relaxed">
          Think of AI as your friendly study partner — helpful, smart, but not perfect. You're still the captain; AI is just your assistant on this learning journey.
        </p>
      </>
    ),
  },
  {
    id: "ai-in-daily-life",
    icon: MapPin,
    title: "Where We Find AI in Daily Life",
    content: (
      <>
        <p className="mb-4 text-base leading-relaxed">
          You've already met AI — you just might not have realised it! Here are some places it hides in plain sight:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-card p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              📱 Your Phone Camera
            </h4>
            <p className="text-sm text-muted-foreground">
              Detects faces, adds filters, or improves lighting.
            </p>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🗺️ Google Maps
            </h4>
            <p className="text-sm text-muted-foreground">
              Predicts traffic and suggests faster routes.
            </p>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🎵 YouTube & Spotify
            </h4>
            <p className="text-sm text-muted-foreground">
              Recommend videos or songs you'll like.
            </p>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🛒 Online Shopping
            </h4>
            <p className="text-sm text-muted-foreground">
              Shows "you might also like" suggestions.
            </p>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🎤 Voice Assistants
            </h4>
            <p className="text-sm text-muted-foreground">
              Alexa, Siri, or Google Assistant understand and reply to you.
            </p>
          </div>
          <div className="bg-gradient-card p-4 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              🏥 Healthcare & More
            </h4>
            <p className="text-sm text-muted-foreground">
              In hospitals, farms, and even cricket analysis!
            </p>
          </div>
        </div>
        <p className="text-base leading-relaxed">
          Even your school's attendance system, digital banking apps, and language translators use AI.
        </p>
        <p className="text-base leading-relaxed mt-2 font-semibold text-primary">
          So, next time you ask your phone for directions or play a smart game, remember — you're already working <em>with</em> AI.
        </p>
      </>
    ),
  },
];

const Lessons = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { toast } = useToast();

  // Load completed sections from progress store on mount
  useEffect(() => {
    const progress = getProgress();
    setCompletedSections(progress.completedLessons);
    
    // Find the first incomplete lesson
    const firstIncomplete = lessonSections.findIndex(
      (lesson) => !progress.completedLessons.includes(lesson.id)
    );
    if (firstIncomplete !== -1) {
      setCurrentLessonIndex(firstIncomplete);
    } else {
      // All lessons completed, show the last one
      setCurrentLessonIndex(lessonSections.length - 1);
    }
  }, []);

  const handleCompleteSection = async (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      await markLessonComplete(sectionId);
      
      toast({
        title: "Lesson Complete! 🎉",
        description: "Great job! Moving to the next lesson...",
      });

      // Move to next lesson after a short delay
      setTimeout(() => {
        if (currentLessonIndex < lessonSections.length - 1) {
          setCurrentLessonIndex(currentLessonIndex + 1);
        }
      }, 1000);
    }
  };


  const currentLesson = lessonSections[currentLessonIndex];
  const Icon = currentLesson.icon;
  const isCompleted = completedSections.includes(currentLesson.id);
  const progress = (completedSections.length / lessonSections.length) * 100;
  const allCompleted = completedSections.length === lessonSections.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-bold">
              Understanding <span className="bg-gradient-hero bg-clip-text text-transparent">AI</span> the Fun Way!
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn the fundamentals of artificial intelligence step by step
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-card bg-gradient-card">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold mb-1">Your Progress</p>
                      <p className="text-sm text-muted-foreground">
                        Lesson {currentLessonIndex + 1} of {lessonSections.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-xs text-center text-muted-foreground">
                    {completedSections.length} of {lessonSections.length} lessons completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Lesson Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <Card className="shadow-elevated border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <motion.div
                      className="p-3 rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 shadow-glow"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="flex-1 text-2xl">{currentLesson.title}</span>
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle2 className="h-7 w-7 text-success" />
                      </motion.div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-foreground leading-relaxed"
                  >
                    {currentLesson.content}
                  </motion.div>

                  {!isCompleted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        onClick={() => handleCompleteSection(currentLesson.id)}
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg"
                      >
                        Mark as Complete
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-success/10 border-2 border-success/30 p-4 rounded-lg text-center"
                    >
                      <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                      <p className="font-semibold text-success mb-1">Lesson Complete! 🎉</p>
                      {currentLessonIndex < lessonSections.length - 1 ? (
                        <p className="text-sm text-muted-foreground">
                          Moving to the next lesson...
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Congratulations! You've completed all lessons!
                        </p>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {allCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 justify-center"
            >
              <Button
                variant="outline"
                onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                disabled={currentLessonIndex === 0}
              >
                Previous Lesson
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentLessonIndex(Math.min(lessonSections.length - 1, currentLessonIndex + 1))}
                disabled={currentLessonIndex === lessonSections.length - 1}
              >
                Next Lesson
              </Button>
            </motion.div>
          )}

          {/* Lesson Navigation Dots */}
          <div className="flex justify-center gap-2">
            {lessonSections.map((lesson, index) => {
              const isActive = index === currentLessonIndex;
              const isDone = completedSections.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    // Only allow navigation to completed lessons or current lesson
                    if (isDone || isActive) {
                      setCurrentLessonIndex(index);
                    }
                  }}
                  disabled={!isDone && !isActive}
                  className={`w-3 h-3 rounded-full transition-all ${
                    isActive
                      ? "bg-primary scale-125"
                      : isDone
                      ? "bg-success hover:scale-110 cursor-pointer"
                      : "bg-muted cursor-not-allowed opacity-50"
                  }`}
                  title={lesson.title}
                />
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Lessons;
