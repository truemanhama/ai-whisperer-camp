import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Download, RotateCcw } from "lucide-react";
import Footer from "@/components/Footer";
import BadgeDisplay from "@/components/BadgeDisplay";
import ProgressBar from "@/components/ProgressBar";
import { getProgress, resetProgress } from "@/lib/progressStore";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import jsPDF from "jspdf";

const Review = () => {
  const progress = getProgress();
  const { toast } = useToast();
  const { user } = useUser();
  
  // Get user's first name, or fallback to "there" if not available
  const userName = user?.firstName || "there";

  const badges = [
    {
      id: "lesson-complete",
      name: "Lesson Master",
      icon: "star" as const,
      earned: progress.completedLessons.length >= 5,
      description: "Complete all lessons",
    },
    {
      id: "real-or-ai-expert",
      name: "Detection Pro",
      icon: "target" as const,
      earned: (progress.activityScores["real-or-ai"] || 0) >= 80,
      description: "Score 80+ on Real or AI",
    },
    {
      id: "myth-buster",
      name: "Myth Buster",
      icon: "zap" as const,
      earned: (progress.activityScores["myths-quiz"] || 0) >= 80,
      description: "Score 80+ on Myths Quiz",
    },
    {
      id: "ai-builder",
      name: "AI Builder",
      icon: "trophy" as const,
      earned: (progress.activityScores["build-ai"] || 0) >= 90,
      description: "Build AI with 90%+ accuracy",
    },
    {
      id: "completionist",
      name: "Completionist",
      icon: "award" as const,
      earned:
        progress.completedLessons.length >= 5 &&
        Object.keys(progress.activityScores).length >= 3,
      description: "Complete everything",
    },
  ];

  const totalPossibleScore = 300; // 100 points per activity
  const completionPercentage = Math.round((progress.totalScore / totalPossibleScore) * 100);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProgress();
      toast({
        title: "Progress Reset",
        description: "All your progress has been cleared.",
      });
      window.location.reload();
    }
  };

  const handleDownloadCertificate = () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create PDF in landscape orientation
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Background color
      pdf.setFillColor(240, 248, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Border
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(2);
      pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");

      // Inner decorative border
      pdf.setLineWidth(0.5);
      pdf.rect(15, 15, pageWidth - 30, pageHeight - 30, "S");

      // Title
      pdf.setFontSize(40);
      pdf.setTextColor(30, 58, 138);
      pdf.text("Certificate of Completion", pageWidth / 2, 40, { align: "center" });

      // Decorative line under title
      pdf.setLineWidth(1);
      pdf.setDrawColor(59, 130, 246);
      pdf.line(60, 50, pageWidth - 60, 50);

      // Main text
      pdf.setFontSize(18);
      pdf.setTextColor(50, 50, 50);
      pdf.text("This is to certify that", pageWidth / 2, 75, { align: "center" });

      // User name
      pdf.setFontSize(32);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont(undefined, "bold");
      pdf.text(`${user.firstName} ${user.lastName}`, pageWidth / 2, 95, { align: "center" });

      // Achievement text
      pdf.setFontSize(18);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont(undefined, "normal");
      pdf.text("has successfully completed", pageWidth / 2, 115, { align: "center" });

      // Course name
      pdf.setFontSize(24);
      pdf.setTextColor(30, 58, 138);
      pdf.setFont(undefined, "bold");
      pdf.text("AI Explorers Course", pageWidth / 2, 135, { align: "center" });

      // Score and details
      pdf.setFontSize(14);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont(undefined, "normal");
      pdf.text(`Total Score: ${progress.totalScore} points | Completion: ${completionPercentage}%`, pageWidth / 2, 152, { align: "center" });
      pdf.text(`Badges Earned: ${earnedBadges}/${badges.length}`, pageWidth / 2, 162, { align: "center" });

      // Date
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.setFontSize(12);
      pdf.text(`Issued on: ${today}`, pageWidth / 2, 180, { align: "center" });

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("AI Explorers Educational Platform", pageWidth / 2, pageHeight - 20, { align: "center" });

      // Save the PDF
      pdf.save(`AI-Explorers-Certificate-${user.firstName}-${user.lastName}.pdf`);

      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been saved successfully!",
      });
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const earnedBadges = badges.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen bg-background">

      <div className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              👋 {userName}, here is your progress.
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your learning journey and earn achievements
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="shadow-elevated bg-gradient-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                Overall Completion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {progress.totalScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {earnedBadges}/{badges.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {progress.completedLessons.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Lessons Complete</div>
                </div>
              </div>

              <ProgressBar
                value={completionPercentage}
                max={100}
                label="Course Completion"
                showPercentage
              />
            </CardContent>
          </Card>

          {/* Activity Scores */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Activity Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                value={progress.activityScores["real-or-ai"] || 0}
                max={100}
                label="Real or AI? Challenge"
                showPercentage
              />
              <ProgressBar
                value={progress.activityScores["myths-quiz"] || 0}
                max={100}
                label="AI Myths & Truths Quiz"
                showPercentage
              />
              <ProgressBar
                value={progress.activityScores["build-ai"] || 0}
                max={100}
                label="Build a Mini AI"
                showPercentage
              />
            </CardContent>
          </Card>

          {/* Badges */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl font-bold text-center">Your Badges</h2>
            <BadgeDisplay badges={badges} />
          </div>

          {/* Certificate */}
          {completionPercentage >= 80 && (
            <Card className="shadow-elevated bg-gradient-hero text-primary-foreground animate-bounce-in">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="text-5xl mb-2">🎓</div>
                <h3 className="text-2xl font-bold">Certificate of Completion</h3>
                <p className="text-primary-foreground/80">
                  Congratulations! You've completed the AI Explorers course!
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="gap-2"
                  onClick={handleDownloadCertificate}
                >
                  <Download className="h-5 w-5" />
                  Download Certificate
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="gap-2" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
                  Reset Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Review;
