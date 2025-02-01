import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GameStage } from "@/config/gameConfig";

type GameStageTimerProps = {
  stage: GameStage;
  countdown: number | null;
};

const GameStageTimer = ({ stage, countdown }: GameStageTimerProps) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    setIsBlinking(countdown !== null && countdown < 10);
  }, [countdown]);

  const getStageInfo = () => {
    switch (stage) {
      case "topic_review":
        return {
          title: "Topic Review",
          action: "Review the topic"
        };
      case "chat":
        return {
          title: "Discussion",
          action: "Chat active"
        };
      case "voting":
        return {
          title: "Voting",
          action: "Choose AI players"
        };
      case "waiting":
        return {
          title: "Waiting",
          action: "Players joining"
        };
      case "awaiting_votes":
        return {
          title: "Awaiting Votes",
          action: "Votes pending"
        };
      case "results":
        return {
          title: "Results",
          action: "Game ended"
        };
      default:
        return {
          title: "Unknown",
          action: "Unknown"
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-lg">
      <div>
        <h3 className="text-sm font-medium text-foreground">{stageInfo.title}</h3>
        <p className="text-xs text-muted-foreground">{stageInfo.action}</p>
      </div>
      {countdown !== null && (
        <div
          className={cn(
            "px-2 py-0.5 rounded bg-muted/30 font-mono text-sm",
            isBlinking && "animate-pulse text-red-500",
            !isBlinking && "text-foreground"
          )}
        >
          {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};

export default GameStageTimer;