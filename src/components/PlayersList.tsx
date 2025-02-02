import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PlayerAvatar from "./PlayerAvatar";
import { User, Bot, Info } from "lucide-react";
import { Button } from "./ui/button";

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
  stage?: 'topic_discovery' | 'discussion' | 'human_detection' | 'awaiting_votes' | 'results' | 'waiting';
  onVoteSubmit?: (votes: Record<string, 'human' | 'ai'>) => void;
};

const PlayersList = ({ 
  players, 
  currentPlayerAddress, 
  onGameStart, 
  isInGame = false,
  showResults = false,
  stage = 'topic_discovery',
  onVoteSubmit
}: PlayersListProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [votes, setVotes] = useState<Record<string, 'human' | 'ai'>>({});

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

  const handleVoteChange = (playerId: string, vote: 'human' | 'ai') => {
    setVotes(prev => ({
      ...prev,
      [playerId]: vote
    }));
  };

  const canConfirm = () => {
    if (stage !== 'human_detection') return false;
    
    return players
      .filter(player => player.address !== currentPlayerAddress)
      .every(player => votes[player.id]);
  };

  const handleConfirm = () => {
    if (onVoteSubmit && canConfirm()) {
      onVoteSubmit(votes);
    }
  };

  // Only show voting UI during discussion stage
  const showVoting = stage === 'discussion';

  // Don't render if not in discussion stage
  if (!showVoting) {
    return null;
  }

  return (
    <div className="box-border w-[360px] flex flex-col items-start p-3 gap-5 bg-[#1C1917] border border-[#44403B]/50 rounded-2xl">
      <div className="w-full flex flex-col items-start gap-2">
        <div className="flex flex-row justify-center items-center p-2 gap-1">
          <h2 className="font-['Inria_Serif'] font-normal text-2xl leading-7 text-white">
            Classify Players
          </h2>
        </div>
        
        <div className="flex flex-col gap-1 w-full">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#1C1917]"
            >
              <div className="flex items-center gap-2">
                <PlayerAvatar 
                  type={player.type} 
                  variant={(index % 6 + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                  className="w-6 h-6"
                />
                <span className="text-base font-medium text-white font-['Instrument_Sans']">
                  {player.alias}
                </span>
              </div>
              
              {player.address === currentPlayerAddress ? (
                <span className="px-1.5 py-0.5 text-sm bg-[#00C951] text-[#1C1917] rounded-xl font-medium font-['Instrument_Sans']">
                  You
                </span>
              ) : showVoting && (
                <div className="flex gap-0.5 p-0.5 bg-[#1C1917] rounded-2xl">
                  <button
                    onClick={() => handleVoteChange(player.id, 'human')}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-xl transition-colors ${
                      votes[player.id] === 'human' 
                        ? 'bg-[#F5F5F4] text-[#1C1917]' 
                        : 'text-[#D6D3D1] hover:bg-[#44403B]'
                    }`}
                  >
                    <User className="h-3 w-3" />
                    <span className="text-sm font-medium font-['Instrument_Sans']">Human</span>
                  </button>
                  <button
                    onClick={() => handleVoteChange(player.id, 'ai')}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-xl transition-colors ${
                      votes[player.id] === 'ai' 
                        ? 'bg-[#44403B] text-[#E7E5E4]' 
                        : 'text-[#D6D3D1] hover:bg-[#44403B]'
                    }`}
                  >
                    <Bot className="h-3 w-3" />
                    <span className="text-sm font-medium font-['Instrument_Sans']">AI</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showVoting && (
          <div className="mt-4 space-y-4 w-full">
            <div className="flex items-start gap-3 p-1">
              <Info className="h-5 w-5 text-[#FD9A00]" />
              <p className="text-xs font-medium text-[#79716B] font-['Instrument_Sans'] leading-[140%]">
                You will make your final choice in <span className="text-white">Human detection</span> stage
              </p>
            </div>
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm()}
              className={`w-full h-12 rounded-lg font-['Inria_Serif'] font-bold text-xl italic ${
                canConfirm()
                  ? 'bg-[#FD9A00] hover:bg-[#FD9A00]/90 text-[#1C1917]'
                  : 'bg-[#44403B] text-[#1C1917] opacity-50 cursor-not-allowed'
              }`}
            >
              Confirm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersList;