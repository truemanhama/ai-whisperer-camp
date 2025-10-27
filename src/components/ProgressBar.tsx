import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar = ({ value, max, label, showPercentage = true, className }: ProgressBarProps) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <Progress value={percentage} className="h-3" />
    </div>
  );
};

export default ProgressBar;
