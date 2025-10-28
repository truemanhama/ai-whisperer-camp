import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface DataSharingMapProps {
  onComplete: (data: any) => void;
}

const DataSharingMap = ({ onComplete }: DataSharingMapProps) => {
  const [placements, setPlacements] = useState<{ [key: string]: string }>({});
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState("");

  const circles = ["Myself", "Friends", "Public", "Digital", "Others/Organizations"];
  
  const dataItems = [
    "Location data",
    "Personal photos",
    "School information",
    "Browsing history",
    "Social media posts",
    "Health records",
    "Shopping habits",
    "Email address"
  ];

  const handleDrop = (item: string, circle: string) => {
    setPlacements({ ...placements, [item]: circle });
  };

  const unplacedItems = dataItems.filter(item => !placements[item]);
  const allPlaced = unplacedItems.length === 0;

  const handleContinue = () => {
    if (allPlaced && !showReflection) {
      setShowReflection(true);
    } else if (showReflection) {
      onComplete({ placements, reflection });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Data Sharing Map</h3>
        <p className="text-muted-foreground">
          Drag each data item to the circle that best represents who has access to it in your digital life.
        </p>

        {/* Unplaced Items */}
        {unplacedItems.length > 0 && (
          <Card className="p-4">
            <p className="text-sm font-medium mb-3">Items to place:</p>
            <div className="flex flex-wrap gap-2">
              {unplacedItems.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="cursor-move hover:shadow-glow transition-shadow"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Circles */}
        <div className="grid gap-4">
          {circles.map((circle) => (
            <Card
              key={circle}
              className="p-4 min-h-[80px] hover:border-primary/50 transition-colors"
            >
              <h4 className="font-semibold mb-2 text-primary">{circle}</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(placements)
                  .filter(([_, c]) => c === circle)
                  .map(([item]) => (
                    <Badge
                      key={item}
                      className="cursor-pointer"
                      onClick={() => {
                        const newPlacements = { ...placements };
                        delete newPlacements[item];
                        setPlacements(newPlacements);
                      }}
                    >
                      {item} ×
                    </Badge>
                  ))}
              </div>
              {/* Simplified drop zones */}
              {unplacedItems.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {unplacedItems.slice(0, 4).map((item) => (
                    <Button
                      key={item}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-auto py-1"
                      onClick={() => handleDrop(item, circle)}
                    >
                      + {item}
                    </Button>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {showReflection && (
          <Card className="p-6 bg-secondary/20 animate-scale-in">
            <h4 className="font-semibold mb-3">Reflection:</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Think about your data placements. Are you surprised by how much data exists in the "Digital" 
              or "Others/Organizations" circles? What does this tell you about your digital footprint?
            </p>
            <Textarea
              placeholder="Share your thoughts..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
            />
          </Card>
        )}

        <Button
          onClick={handleContinue}
          disabled={!allPlaced || (showReflection && !reflection.trim())}
          className="w-full shadow-glow"
        >
          {showReflection ? "Continue" : "Reflect on Your Choices"}
        </Button>
      </div>
    </div>
  );
};

export default DataSharingMap;
