"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Sparkles,
  Lightbulb,
  Copy,
  CheckCheck,
  Loader2,
  Palette,
  Wand2,
} from "lucide-react";
import { useToast } from "./hooks/use-toast";

const gradients = [
  "from-pink-500 to-orange-400",
  "from-green-400 to-cyan-500",
  "from-purple-500 to-indigo-500",
  "from-yellow-400 to-orange-500",
  "from-blue-500 to-indigo-500",
  "from-red-500 to-pink-500",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-purple-600",
];

export default function TitleGenerator() {
  const [topic, setTopic] = useState("");
  const [titleCount, setTitleCount] = useState(5); // Default title count
  const [wordCount, setWordCount] = useState(3); // Default word count
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const [bgGradient, setBgGradient] = useState(
    "from-violet-600 via-pink-500 to-orange-500"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) return;

    setIsLoading(true);
    setTitles([]);

    const gradientOptions = [
      "from-violet-600 via-pink-500 to-orange-500",
      "from-blue-600 via-cyan-500 to-green-400",
      "from-fuchsia-500 via-purple-500 to-indigo-600",
      "from-rose-500 via-red-500 to-amber-500",
    ];
    setBgGradient(
      gradientOptions[Math.floor(Math.random() * gradientOptions.length)]
    );

    try {
      const response = await fetch(
        "http://localhost:5254/api/Main/generate-titles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            TitleCount: titleCount,
            WordCount: wordCount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate titles");
      }

      const data = await response.json();
      setTitles(data.titles);
    } catch (error) {
      console.error("Error generating titles:", error);
      toast({
        title: "Error",
        description: "Failed to generate titles. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    // Remove numbering and quotes from the title
    const cleanedText = text.replace(/^\d+\.\s*"?|"?$/g, "");

    navigator.clipboard.writeText(cleanedText);
    setCopiedIndex(index);

    toast({
      title: "✨ Copied to clipboard!",
      description: "The title has been copied to your clipboard.",
      duration: 2000,
    });

    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${bgGradient} transition-all duration-1000`}
    >
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <CardHeader className="text-center space-y-2 pb-2 relative z-10">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-3 rounded-full shadow-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
              Title Generator
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            <span className="text-pink-500 font-medium">Transform</span> your
            ideas into
            <span className="text-purple-500 font-medium"> great</span> titles
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 relative">
              <div className="absolute left-3 top-3 text-amber-500">
                <Lightbulb className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Enter your topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
                className="pl-10 py-6 text-lg border-2 border-pink-200 dark:border-pink-900 focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-sm"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Amount of titles
                </label>
                <Input
                  type="number"
                  placeholder="Amount of titles"
                  value={titleCount}
                  onChange={(e) =>
                    setTitleCount(Math.max(1, Number(e.target.value)))
                  }
                  disabled={isLoading}
                  className="py-2 text-lg border-2 border-pink-200 dark:border-pink-900 focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Length of titles (in words)
                </label>
                <Input
                  type="number"
                  placeholder="Word Count"
                  value={wordCount}
                  onChange={(e) =>
                    setWordCount(Math.max(1, Number(e.target.value)))
                  }
                  disabled={isLoading}
                  className="py-2 text-lg border-2 border-pink-200 dark:border-pink-900 focus-visible:ring-purple-500 focus-visible:border-purple-500 shadow-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-medium transition-all hover:scale-[1.02] bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 border-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating magic...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Amazing Titles
                </>
              )}
            </Button>
          </form>

          {titles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                  Your Vibrant Titles:
                </span>
              </h3>
              <div className="space-y-3">
                {titles.map((title, index) => {
                  const gradient = gradients[index % gradients.length];

                  return (
                    <div key={index}>
                      <div
                        className={`p-4 rounded-lg bg-gradient-to-r ${gradient} hover:shadow-lg transition-all flex justify-between items-center group`}
                      >
                        <p className="font-medium text-white text-sm">
                          {title}
                        </p>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 bg-white/30 hover:bg-white/50 text-white"
                          onClick={() => copyToClipboard(title, index)}
                        >
                          {copiedIndex === index ? (
                            <CheckCheck className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="text-sm text-center flex flex-col relative z-10">
          <div className="w-full max-w-[200px] h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Create <span className="text-pink-500">eye-catching</span> titles
            that
            <span className="text-blue-500"> stand out</span> and
            <span className="text-purple-500"> captivate</span> your audience
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
