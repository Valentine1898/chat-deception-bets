import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PlayerAvatar from "./PlayerAvatar";

type Player = {
  id: string;
  type: 'human' | 'ai';
  alias: string;
  address?: string;
  hasJoined?: boolean;
  votedAsHuman?: boolean;
};

type PlayersListProps = {
  players: Player[];
  currentPlayerAddress?: string;
  onGameStart?: () => void;
  isInGame?: boolean;
  showResults?: boolean;
};

const PlayersList = ({ 
  players, 
  currentPlayerAddress, 
  onGameStart, 
  isInGame = false,
  showResults = false 
}: PlayersListProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const humanPlayers = players.filter(p => p.type === 'human' && p.hasJoined);

  useEffect(() => {
    if (humanPlayers.length === 2 && !isCountingDown) {
      const opponent = humanPlayers.find(p => p.address !== currentPlayerAddress);
      if (opponent) {
        toast({
          title: "Opponent joined!",
          description: `${opponent.address?.slice(0, 6)}...${opponent.address?.slice(-4)} has joined the game.`,
        });
      }

      setIsCountingDown(true);
      setCountdown(3);
    }
  }, [humanPlayers.length, currentPlayerAddress, isCountingDown, toast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      onGameStart?.();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown, onGameStart]);

  return (
    <div className="w-[360px] bg-stone-900 rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <h2 className="text-[32px] font-normal text-white font-['Inria_Serif']">
          Classify Players
        </h2>
        
        <div className="flex flex-col gap-2">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 rounded-lg bg-stone-800 hover:bg-stone-800/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-[#E17100]' : 
                  index === 1 ? 'bg-[#7C3AED]' :
                  index === 2 ? 'bg-[#00C951]' :
                  index === 3 ? 'bg-[#3A77F7]' :
                  index === 4 ? 'bg-[#FD9A00]' :
                  'bg-[#E11D48]'
                }`}>
                  <PlayerAvatar 
                    type={player.type} 
                    variant={(index % 6 + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                    className="w-6 h-6"
                  />
                </div>
                <span className="text-[16px] font-medium text-white">
                  {player.alias}
                </span>
              </div>
              
              {player.address === currentPlayerAddress && (
                <span className="px-3 py-1 text-sm bg-[#00C951] text-[#1C1917] rounded-full font-medium">
                  You
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayersList;