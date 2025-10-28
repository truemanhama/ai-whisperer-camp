import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import WordCloud from "@/components/activities/WordCloud";
import QuestionsGame from "@/components/activities/QuestionsGame";
import AIPrediction from "@/components/activities/AIPrediction";
import DataSharingMap from "@/components/activities/DataSharingMap";
import QuickQuiz from "@/components/activities/QuickQuiz";
import SortData from "@/components/activities/SortData";
import ModelingSimulation from "@/components/activities/ModelingSimulation";
import WrapUp from "@/components/activities/WrapUp";

const AIModule = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [moduleData, setModuleData] = useState<any>({});

  const sections = [
    {
      title: "Welcome",
      component: (
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Exploring AI and Data
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            In this module, you'll explore what intelligence means, experiment with AI responses, 
            and learn how data models the world. Complete each activity to deepen your understanding.
          </p>
          <Button onClick={() => setCurrentSection(1)} size="lg" className="shadow-glow">
            Start Activity <ChevronRight className="ml-2" />
          </Button>
        </div>
      )
    },
    {
      title: "What is Intelligence?",
      component: <WordCloud onComplete={(data) => updateModuleData("wordCloud", data)} />
    },
    {
      title: "Questions Only Game",
      component: <QuestionsGame onComplete={(data) => updateModuleData("questionsGame", data)} />
    },
    {
      title: "How Well Do You Know AI?",
      component: <AIPrediction onComplete={(data) => updateModuleData("aiPrediction", data)} />
    },
    {
      title: "Our Digital Lives",
      component: <DataSharingMap onComplete={(data) => updateModuleData("dataSharing", data)} />
    },
    {
      title: "What is Data?",
      component: <QuickQuiz onComplete={(data) => updateModuleData("quickQuiz", data)} />
    },
    {
      title: "Types of Data",
      component: <SortData onComplete={(data) => updateModuleData("sortData", data)} />
    },
    {
      title: "Modeling the World with Data",
      component: <ModelingSimulation onComplete={(data) => updateModuleData("simulation", data)} />
    },
    {
      title: "Reflection & Wrap-Up",
      component: <WrapUp moduleData={moduleData} />
    }
  ];

  const updateModuleData = (key: string, data: any) => {
    setModuleData((prev: any) => ({ ...prev, [key]: data }));
  };

  const progress = ((currentSection) / (sections.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 shadow-elegant animate-scale-in">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Module Progress</span>
              <span className="text-sm text-muted-foreground">
                Section {currentSection + 1} of {sections.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Section Title */}
          {currentSection > 0 && (
            <h2 className="text-2xl font-bold mb-6 text-primary">
              {sections[currentSection].title}
            </h2>
          )}

          {/* Section Content */}
          <div className="min-h-[400px]">
            {sections[currentSection].component}
          </div>

          {/* Navigation */}
          {currentSection > 0 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                <ChevronLeft className="mr-2" /> Previous
              </Button>
              {currentSection < sections.length - 1 && (
                <Button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  className="shadow-glow"
                >
                  Next <ChevronRight className="ml-2" />
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIModule;
