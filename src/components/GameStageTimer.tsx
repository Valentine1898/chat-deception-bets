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
          action: "Review the topic and prepare for discussion"
        };
      case "chat":
        return {
          title: "Discussion",
          action: "Participate in the discussion"
        };
      case "voting":
        return {
          title: "Voting",
          action: "Mark who you think is AI"
        };
      case "waiting":
        return {
          title: "Waiting",
          action: "Waiting for players to join"
        };
      case "awaiting_votes":
        return {
          title: "Awaiting Votes",
          action: "Waiting for other players to vote"
        };
      case "results":
        return {
          title: "Results",
          action: "Game results"
        };
      default:
        return {
          title: "Unknown Stage",
          action: "Unknown action"
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="flex items-center gap-4 bg-muted/30 px-4 py-2 rounded-lg">
      <div>
        <h3 className="font-semibold text-foreground">{stageInfo.title}</h3>
        <p className="text-sm text-muted-foreground">{stageInfo.action}</p>
      </div>
      {countdown !== null && (
        <div
          className={cn(
            "px-3 py-1 rounded font-mono text-lg",
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