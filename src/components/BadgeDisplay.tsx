import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeItem {
  id: string;
  name: string;
  icon: "trophy" | "star" | "zap" | "target" | "award";
  earned: boolean;
  description: string;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  className?: string;
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  target: Target,
  award: Award,
};

const BadgeDisplay = ({ badges, className }: BadgeDisplayProps) => {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4", className)}>
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon];
        return (
          <div
            key={badge.id}
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all duration-300",
              badge.earned
                ? "border-primary bg-gradient-card shadow-card hover:shadow-elevated animate-bounce-in"
                : "border-border bg-muted/50 opacity-50"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className={cn(
                  "p-3 rounded-full",
                  badge.earned
                    ? "bg-gradient-hero shadow-glow"
                    : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    badge.earned ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <p className={cn(
                  "text-xs font-semibold",
                  badge.earned ? "text-foreground" : "text-muted-foreground"
                )}>
                  {badge.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {badge.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;
