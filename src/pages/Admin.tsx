import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAllUsers, getAllUserProgress, UserData, UserProgress } from "@/lib/firebaseService";
import { Users, TrendingUp, Award, BookOpen, Download, FileSpreadsheet } from "lucide-react";
import Footer from "@/components/Footer";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [users, setUsers] = useState<(UserData & { id: string })[]>([]);
  const [progress, setProgress] = useState<(UserProgress & { sessionId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, progressData] = await Promise.all([
          getAllUsers(),
          getAllUserProgress(),
        ]);
        setUsers(usersData);
        setProgress(progressData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalUsers = users.length;
  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.totalScore || 0), 0) / progress.length)
    : 0;
  const totalBadges = progress.reduce((sum, p) => sum + (p.badges?.length || 0), 0);
  const avgCompletedLessons = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.completedLessons?.length || 0), 0) / progress.length)
    : 0;

  // Grade distribution
  const gradeDistribution = users.reduce((acc, user) => {
    const grade = user.grade || "Unknown";
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    name: grade,
    value: count,
  }));

  // Activity scores aggregation
  const activityScores: Record<string, { total: number; count: number }> = {};
  progress.forEach((p) => {
    if (p.activityScores) {
      Object.entries(p.activityScores).forEach(([activity, score]) => {
        if (!activityScores[activity]) {
          activityScores[activity] = { total: 0, count: 0 };
        }
        activityScores[activity].total += score;
        activityScores[activity].count += 1;
      });
    }
  });

  const activityData = Object.entries(activityScores).map(([activity, data]) => ({
    name: activity.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    avgScore: Math.round(data.total / data.count),
    participants: data.count,
  }));

  // Badge distribution
  const badgeCount: Record<string, number> = {};
  progress.forEach((p) => {
    if (p.badges) {
      p.badges.forEach((badge) => {
        badgeCount[badge] = (badgeCount[badge] || 0) + 1;
      });
    }
  });

  const badgeData = Object.entries(badgeCount).map(([badge, count]) => ({
    name: badge,
    count,
  }));

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  // Format activity name for display
  const formatActivityName = (activityId: string): string => {
    const activityNames: Record<string, string> = {
      "real-or-ai": "Real or AI? Challenge",
      "myths-quiz": "AI Myths & Truths Quiz",
      "build-ai": "Build a Mini AI",
      "ai-module": "AI Module",
    };
    return activityNames[activityId] || activityId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format lesson name for display
  const formatLessonName = (lessonId: string): string => {
    const lessonNames: Record<string, string> = {
      "what-is-ai": "What is AI?",
      "how-ai-works": "How Does AI Work?",
      "ai-bias": "Things to Be Mindful Of (AI Bias)",
      "how-to-use-ai": "How and Where to Use AI",
      "ai-in-daily-life": "Where We Find AI in Daily Life",
    };
    return lessonNames[lessonId] || lessonId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "N/A";
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      }
      return new Date(timestamp).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  // Export all user data to PDF
  const exportToPDF = async () => {
    if (users.length === 0) {
      toast({
        title: "No Data",
        description: "There is no user data to export.",
        variant: "destructive",
      });
      return;
    }

    setExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const lineHeight = 7;
      let yPosition = margin;

      // Helper function to add a new page if needed
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, isBold ? "bold" : "normal");
        pdf.setTextColor(color[0], color[1], color[2]);
        
        const maxWidth = pageWidth - 2 * margin;
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        checkNewPage(lines.length * lineHeight);
        lines.forEach((line: string) => {
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
      };

      // Title Page
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 40, "F");
      
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, "bold");
      pdf.text("AI Explorers - User Data Report", pageWidth / 2, 25, { align: "center" });
      
      yPosition = 50;
      addText(`Generated on: ${new Date().toLocaleString()}`, 10, false, [100, 100, 100]);
      addText(`Total Users: ${users.length}`, 12, true);
      yPosition += 5;

      // Summary Statistics
      addText("Summary Statistics", 16, true, [59, 130, 246]);
      yPosition += 3;
      
      addText(`Total Users: ${totalUsers}`, 11);
      addText(`Average Score: ${avgScore} points`, 11);
      addText(`Total Badges Earned: ${totalBadges}`, 11);
      addText(`Average Lessons Completed: ${avgCompletedLessons}`, 11);
      yPosition += 5;

      // Grade Distribution Chart
      addText("Grade Distribution", 16, true, [59, 130, 246]);
      yPosition += 3;
      
      if (gradeData.length > 0) {
        const chartWidth = pageWidth - 2 * margin;
        const chartHeight = 60;
        const chartX = margin;
        const chartY = yPosition;
        
        checkNewPage(chartHeight + 20);
        
        // Draw chart background
        pdf.setFillColor(250, 250, 250);
        pdf.rect(chartX, chartY, chartWidth, chartHeight, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(chartX, chartY, chartWidth, chartHeight, "S");
        
        // Draw bars for grade distribution
        const maxCount = Math.max(...gradeData.map(d => d.value));
        const barWidth = (chartWidth - 20) / gradeData.length;
        const barMaxHeight = chartHeight - 25;
        
        gradeData.forEach((data, index) => {
          const barHeight = (data.value / maxCount) * barMaxHeight;
          const barX = chartX + 10 + (index * barWidth);
          const barY = chartY + chartHeight - 5 - barHeight;
          
          // Draw bar
          const colorIndex = index % COLORS.length;
          const colors: Record<number, number[]> = {
            0: [59, 130, 246],
            1: [139, 92, 246],
            2: [236, 72, 153],
            3: [34, 197, 94],
            4: [251, 146, 60],
          };
          const color = colors[colorIndex] || [100, 100, 100];
          pdf.setFillColor(color[0], color[1], color[2]);
          pdf.rect(barX, barY, barWidth - 2, barHeight, "F");
          
          // Draw label
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, "normal");
          const labelText = data.name.length > 8 ? data.name.substring(0, 8) : data.name;
          pdf.text(labelText, barX + (barWidth - 2) / 2, chartY + chartHeight - 3, { align: "center" });
          
          // Draw value
          pdf.setFontSize(7);
          pdf.text(data.value.toString(), barX + (barWidth - 2) / 2, barY - 2, { align: "center" });
        });
        
        // Y-axis label
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Number of Users", chartX + 5, chartY + chartHeight / 2, { angle: 90, align: "center" });
        
        yPosition += chartHeight + 10;
      } else {
        addText("No grade distribution data available", 10, false, [150, 150, 150]);
        yPosition += 5;
      }

      // Average Scores Chart
      addText("Average Scores by Activity", 16, true, [59, 130, 246]);
      yPosition += 3;
      
      if (activityData.length > 0) {
        const chartWidth = pageWidth - 2 * margin;
        const chartHeight = 60;
        const chartX = margin;
        const chartY = yPosition;
        
        checkNewPage(chartHeight + 20);
        
        // Draw chart background
        pdf.setFillColor(250, 250, 250);
        pdf.rect(chartX, chartY, chartWidth, chartHeight, "F");
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(chartX, chartY, chartWidth, chartHeight, "S");
        
        // Draw bars for average scores
        const maxScore = Math.max(...activityData.map(d => d.avgScore), 100);
        const barWidth = (chartWidth - 20) / activityData.length;
        const barMaxHeight = chartHeight - 25;
        
        activityData.forEach((data, index) => {
          const barHeight = (data.avgScore / maxScore) * barMaxHeight;
          const barX = chartX + 10 + (index * barWidth);
          const barY = chartY + chartHeight - 5 - barHeight;
          
          // Draw bar
          pdf.setFillColor(59, 130, 246);
          pdf.rect(barX, barY, barWidth - 2, barHeight, "F");
          
          // Draw label (rotated)
          pdf.setFontSize(7);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, "normal");
          const labelText = data.name.length > 10 ? data.name.substring(0, 10) : data.name;
          pdf.text(labelText, barX + (barWidth - 2) / 2, chartY + chartHeight - 3, { align: "center" });
          
          // Draw value
          pdf.setFontSize(7);
          pdf.text(data.avgScore.toString(), barX + (barWidth - 2) / 2, barY - 2, { align: "center" });
        });
        
        // Y-axis label
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Average Score", chartX + 5, chartY + chartHeight / 2, { angle: 90, align: "center" });
        
        yPosition += chartHeight + 10;
      } else {
        addText("No activity score data available", 10, false, [150, 150, 150]);
        yPosition += 5;
      }

      yPosition += 5;

      // User Details
      users.forEach((user, index) => {
        checkNewPage(50); // Reserve space for user section
        
        const userProgress = progress.find((p) => p.sessionId === user.sessionId);
        
        // User Header
        pdf.setFillColor(240, 248, 255);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, "F");
        
        addText(`User ${index + 1}: ${user.firstName} ${user.lastName}`, 14, true, [59, 130, 246]);
        yPosition += 2;
        
        // Basic Information
        addText("Basic Information", 12, true);
        addText(`Name: ${user.firstName} ${user.lastName}`, 10);
        addText(`Grade: ${user.grade || "N/A"}`, 10);
        addText(`School: ${user.school || "N/A"}`, 10);
        if (user.createdAt) {
          addText(`Registered: ${formatTimestamp(user.createdAt)}`, 10);
        }
        yPosition += 2;

        // Progress Information
        if (userProgress) {
          addText("Progress Summary", 12, true);
          addText(`Total Score: ${userProgress.totalScore || 0} points`, 10);
          addText(`Completed Lessons: ${userProgress.completedLessons?.length || 0}`, 10);
          addText(`Badges Earned: ${userProgress.badges?.length || 0}`, 10);
          yPosition += 2;

          // Lesson Scores
          if (userProgress.lessonScores && Object.keys(userProgress.lessonScores).length > 0) {
            addText("Lesson Scores", 12, true);
            Object.entries(userProgress.lessonScores).forEach(([lessonId, score]) => {
              addText(`  • ${formatLessonName(lessonId)}: ${score} points`, 10);
            });
            yPosition += 2;
          }

          // Activity Scores
          if (userProgress.activityScores && Object.keys(userProgress.activityScores).length > 0) {
            addText("Activity Scores", 12, true);
            Object.entries(userProgress.activityScores).forEach(([activityId, score]) => {
              addText(`  • ${formatActivityName(activityId)}: ${score} points`, 10);
            });
            yPosition += 2;
          }

          // Badges
          if (userProgress.badges && userProgress.badges.length > 0) {
            addText("Badges Earned", 12, true);
            userProgress.badges.forEach((badge) => {
              addText(`  • ${badge}`, 10);
            });
            yPosition += 2;
          }

          // Completed Lessons
          if (userProgress.completedLessons && userProgress.completedLessons.length > 0) {
            addText("Completed Lessons", 12, true);
            userProgress.completedLessons.forEach((lessonId) => {
              addText(`  • ${formatLessonName(lessonId)}`, 10);
            });
            yPosition += 2;
          }

          // Reflections
          if (userProgress.reflections && Object.keys(userProgress.reflections).length > 0) {
            addText("Reflection Responses", 12, true);
            Object.entries(userProgress.reflections).forEach(([activityId, reflection]) => {
              checkNewPage(20);
              addText(`${formatActivityName(activityId)}:`, 10, true);
              yPosition += 1;
              const reflectionText = reflection.text || "No reflection provided";
              const reflectionLines = pdf.splitTextToSize(reflectionText, pageWidth - 2 * margin - 10);
              reflectionLines.forEach((line: string) => {
                checkNewPage(lineHeight);
                pdf.setFontSize(9);
                pdf.setTextColor(80, 80, 80);
                pdf.text(`    ${line}`, margin + 5, yPosition);
                yPosition += lineHeight * 0.8;
              });
              if (reflection.timestamp) {
                pdf.setFontSize(8);
                pdf.setTextColor(120, 120, 120);
                pdf.text(`    Submitted: ${formatTimestamp(reflection.timestamp)}`, margin + 5, yPosition);
                yPosition += lineHeight;
              }
              yPosition += 2;
            });
          }
        } else {
          addText("No progress data available", 10, false, [150, 150, 150]);
        }

        // Separator
        yPosition += 3;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      });

      // Save PDF
      const fileName = `AI-Explorers-User-Data-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Export Successful",
        description: `User data exported to ${fileName}`,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // Export all user data to CSV
  const exportToCSV = () => {
    if (users.length === 0) {
      toast({
        title: "No Data",
        description: "There is no user data to export.",
        variant: "destructive",
      });
      return;
    }

    setExportingCSV(true);
    try {
      // CSV Headers
      const headers = [
        "First Name",
        "Last Name",
        "Grade",
        "School",
        "Total Score",
        "Completed Lessons",
        "Badges Earned",
        "Lesson Scores",
        "Activity Scores",
        "Registered Date",
      ];

      // CSV Rows
      const rows = users.map((user) => {
        const userProgress = progress.find((p) => p.sessionId === user.sessionId);
        
        const lessonScores = userProgress?.lessonScores
          ? Object.entries(userProgress.lessonScores)
              .map(([id, score]) => `${formatLessonName(id)}: ${score}`)
              .join("; ")
          : "None";
        
        const activityScores = userProgress?.activityScores
          ? Object.entries(userProgress.activityScores)
              .map(([id, score]) => `${formatActivityName(id)}: ${score}`)
              .join("; ")
          : "None";

        return [
          user.firstName || "",
          user.lastName || "",
          user.grade || "N/A",
          user.school || "N/A",
          userProgress?.totalScore || 0,
          userProgress?.completedLessons?.length || 0,
          userProgress?.badges?.length || 0,
          lessonScores,
          activityScores,
          user.createdAt ? formatTimestamp(user.createdAt) : "N/A",
        ];
      });

      // Escape CSV values (handle commas, quotes, newlines)
      const escapeCSV = (value: string | number): string => {
        const str = String(value);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      // Combine headers and rows
      const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\n");

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `AI-Explorers-User-Data-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `User data exported to CSV`,
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while generating the CSV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingCSV(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor user engagement and activity performance across the platform
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                onClick={exportToPDF}
                disabled={exporting || users.length === 0}
                className="gap-2 flex-1 md:flex-none"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export to PDF"}
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={exportingCSV || users.length === 0}
                variant="outline"
                className="gap-2 flex-1 md:flex-none"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {exportingCSV ? "Exporting..." : "Export to CSV"}
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
          <Card className="border-primary/20 shadow-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered learners
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}</div>
              <p className="text-xs text-muted-foreground">
                Average points earned
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBadges}</div>
              <p className="text-xs text-muted-foreground">
                Badges awarded
              </p>
            </CardContent>
          </Card>

          <Card className="border-chart-1/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCompletedLessons}</div>
              <p className="text-xs text-muted-foreground">
                Completed per user
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <Tabs defaultValue="activities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activities">Activity Performance</TabsTrigger>
            <TabsTrigger value="demographics">User Demographics</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="users">User List</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Average Scores by Activity</CardTitle>
                <CardDescription>
                  Performance metrics across all interactive activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score" />
                      <Bar dataKey="participants" fill="hsl(var(--secondary))" name="Participants" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No activity data available yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  Number of users by grade level
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gradeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={gradeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {gradeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No demographic data available yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Badge Distribution</CardTitle>
                <CardDescription>
                  Most commonly earned achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {badgeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={badgeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No badges earned yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>User List</CardTitle>
                <CardDescription>
                  All registered users and their progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => {
                    const userProgress = progress.find((p) => p.sessionId === user.sessionId);
                    return (
                      <div key={user.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.school} • Grade {user.grade}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {userProgress?.totalScore || 0} points
                          </Badge>
                        </div>
                        {userProgress && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {userProgress.completedLessons?.length || 0} lessons
                            </Badge>
                            <Badge variant="outline">
                              {userProgress.badges?.length || 0} badges
                            </Badge>
                            {userProgress.badges?.map((badge) => (
                              <Badge key={badge} className="bg-accent/20">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {users.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No users registered yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
