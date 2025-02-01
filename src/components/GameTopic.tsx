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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-[32px] bg-[#1C1917]/95 backdrop-blur-sm border border-[#292524] p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[42px] leading-[52px] font-['Inria_Serif'] text-white">
              Chatroom fro Prize Pool <span className="text-primary">{prizePool} ETH</span>
            </h1>
            <p className="text-[#71717A] text-lg">
              id: <span className="font-mono">{gameId}</span>
            </p>
          </div>

          <Card className="bg-[#0C0A09] border-none p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-[#A8A29E] text-2xl font-['Inria_Serif']">Topic:</span>
              <p className="text-white text-2xl font-['Inria_Serif']">
                {topic.description}
              </p>
            </div>
          </Card>
        </div>
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