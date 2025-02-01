import { GameStage } from "@/config/gameConfig";
import GameStageTimer from "./GameStageTimer";

type GameHeaderProps = {
  stage: GameStage;
  countdown: number | null;
};

const GameHeader = ({ stage, countdown }: GameHeaderProps) => {
  return (
    <GameStageTimer stage={stage} countdown={countdown} />
  );
};

export default GameHeader;