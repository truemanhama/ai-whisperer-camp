import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getAllUsers, getAllUserProgress, UserData, UserProgress } from "@/lib/firebaseService";
import { Users, TrendingUp, Award, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";

const Admin = () => {
  const [users, setUsers] = useState<(UserData & { id: string })[]>([]);
  const [progress, setProgress] = useState<(UserProgress & { sessionId: string })[]>([]);
  const [loading, setLoading] = useState(true);

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
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor user engagement and activity performance across the platform
          </p>
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
