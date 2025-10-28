import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface SortDataProps {
  onComplete: (results: any) => void;
}

const SortData = ({ onComplete }: SortDataProps) => {
  const [placements, setPlacements] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const categories = ["Exploratory", "Explanatory", "Predictive"];

  const datasets = [
    {
      name: "Weather patterns over 10 years",
      correct: "Predictive",
      explanation: "Historical weather data helps predict future conditions"
    },
    {
      name: "Survey: Why do students skip breakfast?",
      correct: "Explanatory",
      explanation: "This data explains the reasons behind a behavior"
    },
    {
      name: "Random sample of customer reviews",
      correct: "Exploratory",
      explanation: "This data is used to discover patterns and insights"
    },
    {
      name: "Hospital admission rates analysis",
      correct: "Exploratory",
      explanation: "Initial analysis to understand admission patterns"
    },
    {
      name: "Stock market trends for forecasting",
      correct: "Predictive",
      explanation: "Historical trends used to predict future market behavior"
    },
    {
      name: "Study on factors affecting test scores",
      correct: "Explanatory",
      explanation: "This explains what influences student performance"
    }
  ];

  const handlePlace = (datasetName: string, category: string) => {
    setPlacements({ ...placements, [datasetName]: category });
  };

  const unplaced = datasets.filter(d => !placements[d.name]);
  const allPlaced = unplaced.length === 0;

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleContinue = () => {
    onComplete({ placements, correct: getCorrectCount() });
  };

  const getCorrectCount = () => {
    return datasets.filter(d => placements[d.name] === d.correct).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Sort the Data Types</h3>
        <p className="text-muted-foreground">
          Place each dataset into the correct category based on its purpose.
        </p>

        <div className="grid gap-2 text-sm bg-secondary/20 p-4 rounded-lg">
          <p><strong>Exploratory:</strong> Data used to discover patterns and insights</p>
          <p><strong>Explanatory:</strong> Data that explains why something happens</p>
          <p><strong>Predictive:</strong> Data used to forecast future outcomes</p>
        </div>

        {/* Unplaced datasets */}
        {unplaced.length > 0 && !showResults && (
          <Card className="p-4">
            <p className="text-sm font-medium mb-3">Datasets to sort:</p>
            <div className="space-y-2">
              {unplaced.map((dataset) => (
                <div key={dataset.name} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                  <span className="text-sm">{dataset.name}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Categories */}
        <div className="grid gap-4">
          {categories.map((category) => {
            const itemsInCategory = datasets.filter(d => placements[d.name] === category);
            return (
              <Card key={category} className="p-4">
                <h4 className="font-semibold mb-3 text-primary">{category}</h4>
                <div className="space-y-2">
                  {itemsInCategory.map((dataset) => {
                    const isCorrect = dataset.correct === category;
                    return (
                      <div
                        key={dataset.name}
                        className={`p-3 rounded border ${
                          showResults
                            ? isCorrect
                              ? "bg-primary/10 border-primary/30"
                              : "bg-destructive/10 border-destructive/30"
                            : "bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm">{dataset.name}</span>
                          {showResults && (
                            <div className="flex-shrink-0">
                              {isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                          )}
                        </div>
                        {showResults && !isCorrect && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Correct: {dataset.correct} - {dataset.explanation}
                          </p>
                        )}
                        {showResults && isCorrect && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {dataset.explanation}
                          </p>
                        )}
                        {!showResults && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs mt-2 h-auto py-1"
                            onClick={() => {
                              const newPlacements = { ...placements };
                              delete newPlacements[dataset.name];
                              setPlacements(newPlacements);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {/* Quick add buttons */}
                  {!showResults && unplaced.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {unplaced.slice(0, 3).map((dataset) => (
                        <Button
                          key={dataset.name}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-auto py-1"
                          onClick={() => handlePlace(dataset.name, category)}
                        >
                          + Add "{dataset.name.slice(0, 20)}..."
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {showResults && (
          <Card className="p-6 bg-primary/10 border-primary/20 animate-scale-in">
            <h4 className="font-semibold text-lg mb-2">Results</h4>
            <p className="text-2xl font-bold text-primary mb-4">
              {getCorrectCount()} / {datasets.length} Correct
            </p>
            <p className="text-sm text-muted-foreground">
              Understanding data types helps us choose the right analysis methods and tools for different questions.
            </p>
          </Card>
        )}

        {!showResults ? (
          <Button
            onClick={handleSubmit}
            disabled={!allPlaced}
            className="w-full shadow-glow"
          >
            Check My Answers
          </Button>
        ) : (
          <Button onClick={handleContinue} className="w-full shadow-glow">
            Continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default SortData;
