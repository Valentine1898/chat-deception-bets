import { Card } from "@/components/ui/card";
import GameChat from "./GameChat";

type GameTopicProps = {
  topic: {
    title: string;
    description: string;
  } | null;
  isChatVisible: boolean;
  gameId?: string;
  prizePool?: string;
};

const GameTopic = ({ topic, isChatVisible, gameId, prizePool = "0.0005" }: GameTopicProps) => {
  if (!topic) return null;

  const chatNumber = gameId ? parseInt(gameId.slice(0, 8), 16) % 100 : 44; // Generate a number between 0-99 from gameId

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-2xl bg-[#1C1917]/90 backdrop-blur-sm border border-[#292524] p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[32px] leading-[38px] font-['Inria_Serif'] text-white">
            Chatroom #{chatNumber}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[32px] leading-[38px] font-['Inria_Serif'] text-white">
              Prize Pool
            </span>
            <span className="text-[32px] leading-[38px] font-['Inria_Serif'] text-primary">
              {prizePool} ETH
            </span>
          </div>
        </div>

        <Card className="bg-[#0C0A09] border-none p-6">
          <div className="flex items-center gap-3">
            <span className="text-[#A8A29E] text-2xl font-['Inria_Serif']">Topic:</span>
            <p className="text-white text-2xl font-['Inria_Serif']">
              {topic.description}
            </p>
          </div>
        </Card>
      </div>

      {isChatVisible && (
        <div className="animate-slide-up">
          <GameChat />
        </div>
      )}
    </div>
  );
};

export default GameTopic;