import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface WordCloudProps {
  onComplete: (words: string[]) => void;
}

const WordCloud = ({ onComplete }: WordCloudProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");

  const addWord = () => {
    if (currentWord.trim() && words.length < 5) {
      setWords([...words, currentWord.trim()]);
      setCurrentWord("");
    }
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (words.length >= 3) {
      onComplete(words);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">What comes to mind when you hear "intelligent"?</h3>
        <p className="text-muted-foreground">
          Enter 3-5 words that describe intelligence to you.
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Type a word..."
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addWord()}
            maxLength={20}
          />
          <Button onClick={addWord} disabled={words.length >= 5 || !currentWord.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Word Cloud Display */}
        <div className="min-h-[200px] border-2 border-dashed rounded-lg p-6 flex flex-wrap gap-3 items-center justify-center bg-secondary/20">
          {words.length === 0 ? (
            <p className="text-muted-foreground">Your words will appear here...</p>
          ) : (
            words.map((word, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-lg px-4 py-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                style={{
                  fontSize: `${Math.random() * 0.5 + 1}rem`,
                  transform: `rotate(${Math.random() * 10 - 5}deg)`
                }}
                onClick={() => removeWord(index)}
              >
                {word}
              </Badge>
            ))
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          {words.length}/5 words • Click a word to remove it
        </p>

        <Button
          onClick={handleComplete}
          disabled={words.length < 3}
          className="w-full shadow-glow"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WordCloud;
