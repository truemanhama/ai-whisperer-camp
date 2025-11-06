import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Gamepad2, Trophy, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Brain },
    { path: "/lessons", label: "Lessons", icon: BookOpen },
    { path: "/activities", label: "Activities", icon: Gamepad2 },
    { path: "/ai-module", label: "AI & Data", icon: Brain },
    { path: "/review", label: "Review", icon: Trophy },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/MF Logo_round.png"
            alt="MF Logo"
            className="h-8 w-8 rounded-full object-cover shadow-glow"
          />
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            AI Literacy Initiative for Young Learners
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "gap-2",
                    isActive && "shadow-glow"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="flex md:hidden items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/MF Logo_round.png"
                  alt="MF Logo"
                  className="h-8 w-8 rounded-full object-cover shadow-glow"
                />
                <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">AI Literacy Initiative for Young Learners</span>
              </div>
              <div className="grid gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn("w-full justify-start gap-2", isActive && "shadow-glow")}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
