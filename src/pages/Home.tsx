import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Sparkles, Target, Users } from "lucide-react";
import heroRobot from "@/assets/hero-robot.jpg";
import Footer from "@/components/Footer";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "Learn AI Basics",
      description: "Understand what AI really is and how it works through interactive lessons.",
    },
    {
      icon: Sparkles,
      title: "Interactive Games",
      description: "Test your knowledge with fun activities like 'Real or AI?' image challenges.",
    },
    {
      icon: Target,
      title: "Hands-On Practice",
      description: "Build your own mini AI models and see machine learning in action.",
    },
    {
      icon: Users,
      title: "Track Your Progress",
      description: "Earn badges and certificates as you complete lessons and activities.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container relative py-20 md:py-32 px-4 md:px-0">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-sm font-semibold text-primary">Welcome to AI Explorers</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover the{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Magic of AI
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The AI Literacy Initiative for Young Learners is a dynamic project by Melton Foundation Fellows designed to make Artificial Intelligence exciting, understandable, and meaningful for high school students. Through interactive sessions, stories, and hands-on activities, the initiative helps learners discover what AI really is, how it shapes their daily lives, and how they can use it responsibly and creatively. From smart recommendations on their phones to voice assistants and digital art tools, students explore the hidden world of AI in fun, relatable ways. The goal is simple yet powerful, to sensitise and empower young minds to navigate the AI-driven world confidently, thoughtfully, and with curiosity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/lessons">
                  <Button size="lg" className="gap-2 shadow-glow hover:scale-105 transition-transform">
                    Start Learning <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/activities">
                  <Button size="lg" variant="outline" className="gap-2">
                    Try Activities <Sparkles className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
              <img
                src={heroRobot}
                alt="AI Robot Teaching"
                className="relative rounded-2xl shadow-elevated w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-0">
          <div className="text-center mb-12 space-y-4 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold">
              What You'll Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI Explorers makes learning about artificial intelligence fun, interactive, and easy to understand.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg bg-gradient-hero w-fit shadow-glow">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-0">
          <Card className="relative overflow-hidden shadow-elevated">
            <div className="absolute inset-0 bg-gradient-hero opacity-10" />
            <CardContent className="relative py-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Explore AI?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students learning about artificial intelligence in a fun, 
                interactive way. No prior experience needed!
              </p>
              <Link to="/lessons">
                <Button size="lg" className="gap-2 shadow-glow">
                  Begin Your Journey <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
