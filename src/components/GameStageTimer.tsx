import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GameStage } from "@/config/gameConfig";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Timer } from "lucide-react";

type GameStageTimer = {
  stage: GameStage;
  countdown: number | null;
};

const GameStageTimer = ({ stage, countdown }: GameStageTimer) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setIsBlinking(countdown !== null && countdown < 10);
  }, [countdown]);

  const stages = [
    {
      value: "topic_review",
      label: "Topic discovery",
      status: stage === "topic_review" ? "active" : 
              (["chat", "voting", "results"].includes(stage) ? "completed" : "pending")
    },
    {
      value: "chat",
      label: "Discussion on arena",
      status: stage === "chat" ? "active" : 
              (["voting", "results"].includes(stage) ? "completed" : "pending")
    },
    {
      value: "voting",
      label: "Human detection",
      status: stage === "voting" ? "active" : 
              (stage === "results" ? "completed" : "pending")
    }
  ];

  const getStageIndex = () => {
    switch (stage) {
      case "topic_review":
        return "0";
      case "chat":
        return "1";
      case "voting":
      case "awaiting_votes":
        return "2";
      case "results":
        return "2";
      default:
        return "0";
    }
  };

  return (
    <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-muted">
      <div className="container mx-auto">
        <Tabs defaultValue={getStageIndex()} value={getStageIndex()} className="w-full">
          <TabsList className="w-full justify-start h-14 bg-transparent gap-1">
            {stages.map((s, index) => (
              <TabsTrigger
                key={s.value}
                value={index.toString()}
                disabled
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all relative h-10 my-2",
                  s.status === "completed" && "bg-muted/30 text-muted-foreground",
                  s.status === "active" && "bg-primary text-primary-foreground",
                  s.status === "pending" && "bg-muted/10 text-muted-foreground/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-sm",
                    s.status === "completed" && "bg-muted/20 text-accent",
                    s.status === "active" && "bg-black/20 text-primary-foreground",
                    s.status === "pending" && "bg-muted/20 text-muted-foreground"
                  )}>
                    {s.status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      (index + 1)
                    )}
                  </span>
                  <span className="text-sm font-medium">{s.label}</span>
                </div>
                {countdown !== null && (
                  <div className={cn(
                    "flex items-center gap-1 ml-2 text-sm font-mono",
                    s.status === "active" && "bg-black/20 px-2 py-0.5 rounded-full",
                    isBlinking && s.status === "active" && "animate-pulse text-red-500"
                  )}>
                    <Timer className="h-3.5 w-3.5" />
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default GameStageTimer;