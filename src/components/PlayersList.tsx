import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PlayerAvatar from "./PlayerAvatar";
import { User, Bot } from "lucide-react";
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
  gamePhase?: 'waiting' | 'topic_review' | 'chat' | 'voting' | 'results';
  onVoteSubmit?: (votes: Record<string, 'human' | 'ai'>) => void;
};

const PlayersList = ({ 
  players, 
  currentPlayerAddress, 
  onGameStart, 
  isInGame = false,
  showResults = false,
  gamePhase = 'waiting',
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

  const handleVoteChange = (playerId: string, isHuman: boolean) => {
    setVotes(prev => ({
      ...prev,
      [playerId]: isHuman ? 'human' : 'ai'
    }));
  };

  const handleVoteSubmit = () => {
    if (!onVoteSubmit) return;
    
    const allPlayersVotedFor = players.every(player => 
      player.id === currentPlayerAddress || votes[player.id]
    );

    if (!allPlayersVotedFor) {
      toast({
        title: "Cannot submit yet",
        description: "Please classify all players before submitting",
        variant: "destructive"
      });
      return;
    }

    onVoteSubmit(votes);
    toast({
      title: "Votes submitted!",
      description: "Your classification has been recorded",
    });
  };

  const showVoting = gamePhase === 'voting';

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
              
              {player.address === currentPlayerAddress ? (
                <span className="px-3 py-1 text-sm bg-[#00C951] text-[#1C1917] rounded-full font-medium">
                  You
                </span>
              ) : showVoting && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoteChange(player.id, true)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                      votes[player.id] === 'human' 
                        ? 'bg-stone-700 text-white' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm">Human</span>
                  </button>
                  <button
                    onClick={() => handleVoteChange(player.id, false)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                      votes[player.id] === 'ai' 
                        ? 'bg-stone-700 text-white' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Bot className="h-4 w-4" />
                    <span className="text-sm">AI</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showVoting && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-stone-400">
              <span className="text-[#F59E0B]">i</span>
              <span>You will make your final choice in</span>
              <span className="text-white">Human detection</span>
              <span>stage</span>
            </div>
            <Button 
              onClick={handleVoteSubmit}
              className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-[#1C1917] font-medium"
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