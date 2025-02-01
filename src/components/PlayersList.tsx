import { useEffect, useState } from "react";
import { User, Bot, CircleUser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="w-[360px] h-[360px] bg-[#1C1917] border border-[#44403B]/50 rounded-2xl p-3 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center h-11 gap-1">
          <h2 className="text-2xl font-normal text-white font-['Inria_Serif']">
            Classify Players
          </h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#1C1917]"
            >
              <div className="flex items-center gap-2 mx-auto">
                <div className="w-6 h-6 bg-[#0C0A09] rounded-full flex items-center justify-center">
                  {isInGame ? (
                    <CircleUser className="h-5 w-5 text-accent" />
                  ) : (
                    player.type === 'human' ? (
                      <User className="h-5 w-5 text-accent" />
                    ) : (
                      <Bot className="h-5 w-5 text-accent" />
                    )
                  )}
                </div>
                <span className="text-base font-medium text-white">
                  {player.alias}
                  {player.address === currentPlayerAddress && (
                    <span className="ml-2 px-1.5 py-0.5 text-sm bg-[#00C951] text-[#1C1917] rounded-xl">
                      You
                    </span>
                  )}
                </span>
              </div>
              
              {!isInGame && !showResults && (
                <div className="flex gap-1 bg-[#1C1917] rounded-2xl p-0.5">
                  <button className="px-1.5 py-0.5 rounded-xl bg-[#F5F5F4] text-sm text-[#1C1917] flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Human
                  </button>
                  <button className="px-1.5 py-0.5 rounded-xl bg-[#44403B] text-sm text-[#E7E5E4] flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    AI
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayersList;