import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GameStage } from "@/config/gameConfig";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer } from "lucide-react";

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
      number: 1,
      status: stage === "topic_review" ? "active" : 
              (["chat", "voting", "awaiting_votes", "results"].includes(stage) ? "completed" : "pending")
    },
    {
      value: "chat",
      label: "Discussion on arena",
      number: 2,
      status: stage === "chat" ? "active" : 
              (["voting", "awaiting_votes", "results"].includes(stage) ? "completed" : "pending")
    },
    {
      value: "voting",
      label: "Human detection",
      number: 3,
      status: stage === "voting" || stage === "awaiting_votes" ? "active" : 
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

  const shouldShowCountdown = (stageStatus: string) => {
    return stageStatus === "active" && countdown !== null;
  };

  return (
    <div className="w-full bg-[#1C1917] border-b border-[#44403B]/50">
      <div className="container mx-auto">
        <Tabs defaultValue={getStageIndex()} value={getStageIndex()} className="w-full">
          <TabsList className="flex flex-row items-start p-3 gap-5 h-[62px] bg-stone-900">
            {stages.map((s) => (
              <TabsTrigger
                key={s.value}
                value={s.value}
                disabled
                className={cn(
                  "flex-1 flex flex-row justify-between items-center p-2 h-[38px] rounded-lg",
                  s.status === "completed" && "bg-[#292524] text-white",
                  s.status === "active" && "bg-[#FD9A00]",
                  s.status === "pending" && "bg-[#292524] text-white"
                )}
              >
                <div className="flex items-center gap-2 mx-auto w-[285px]">
                  <div className="flex items-center gap-8">
                    <div className={cn(
                      "flex items-center justify-center w-[22px] h-[22px] rounded-xl font-['Chivo_Mono'] text-sm",
                      s.status === "completed" && "bg-[#0C0A09] text-[#57534D]",
                      s.status === "active" && "bg-[#E17100] text-[#0C0A09]",
                      s.status === "pending" && "bg-[#0C0A09] text-[#57534D]"
                    )}>
                      {s.number}
                    </div>
                    <span className={cn(
                      "text-base font-['Instrument_Sans'] font-medium",
                      s.status === "active" && "text-[#0C0A09]",
                      s.status !== "active" && "text-white"
                    )}>
                      {s.label}
                    </span>
                  </div>
                  {shouldShowCountdown(s.status) && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 h-[22px] bg-black rounded-xl">
                      <Timer className="h-3 w-3 text-[#E7E5E4]" />
                      <span className="font-['Chivo_Mono'] text-sm text-[#FD9A00]">
                        {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default GameStageTimer;