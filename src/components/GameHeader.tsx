import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import GameStageTimer from "./GameStageTimer";
import { GameStage } from "@/config/gameConfig";

type GameHeaderProps = {
  stage: GameStage;
  countdown: number | null;
};

const GameHeader = ({ stage, countdown }: GameHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-muted p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Link>
        
        <div className="flex items-center gap-6">
          <img 
            src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
            alt="Alan Turing" 
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-foreground">Turing Arena</h1>
        </div>

        <GameStageTimer 
          stage={stage}
          countdown={countdown}
        />
      </div>
    </div>
  );
};

export default GameHeader;