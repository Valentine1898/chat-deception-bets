import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bot, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PlayerAvatar from "./PlayerAvatar";

type Player = {
  id: string;
  type: 'human' | 'ai';
  alias: string;
  address?: string;
  hasJoined?: boolean;
};

type GameVotingProps = {
  players: Player[];
  currentPlayerAddress?: string;
  onVoteSubmit: (votes: Record<string, 'human' | 'ai'>) => void;
  showConfirmButton?: boolean;
};

const GameVoting = ({ players, currentPlayerAddress, onVoteSubmit, showConfirmButton = false }: GameVotingProps) => {
  const { toast } = useToast();
  const [votes, setVotes] = React.useState<Record<string, 'human' | 'ai'>>({});

  // Initialize current player as human
  React.useEffect(() => {
    if (currentPlayerAddress) {
      setVotes(prev => ({
        ...prev,
        [currentPlayerAddress]: 'human'
      }));
    }
  }, [currentPlayerAddress]);

  const handleVoteChange = (playerId: string, isHuman: boolean) => {
    setVotes(prev => ({
      ...prev,
      [playerId]: isHuman ? 'human' : 'ai'
    }));
  };

  const canSubmit = () => {
    return players.every(player => 
      player.id === currentPlayerAddress || votes[player.id]
    );
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
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

  const getPlayerColor = (index: number) => {
    const colors = [
      'bg-[#E17100]',
      'bg-[#7C3AED]',
      'bg-[#00C951]',
      'bg-[#3A77F7]',
      'bg-[#FD9A00]',
      'bg-[#E11D48]'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="w-full bg-stone-900 border-none">
      <CardHeader>
        <CardTitle className="text-[32px] font-normal text-white font-['Inria_Serif']">
          Classify Players
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              player.id === currentPlayerAddress ? 'bg-stone-800' : 'bg-stone-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPlayerColor(index)}`}>
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
            
            <div className="flex items-center gap-2">
              {player.id === currentPlayerAddress ? (
                <span className="px-3 py-1 text-sm bg-[#00C951] text-[#1C1917] rounded-full font-medium">
                  You
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVoteChange(player.id, true)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                      votes[player.id] === 'human' 
                        ? 'bg-white text-stone-900' 
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Human</span>
                  </button>
                  <button
                    onClick={() => handleVoteChange(player.id, false)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                      votes[player.id] === 'ai' 
                        ? 'bg-white text-stone-900' 
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium">AI</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {showConfirmButton && (
          <div className="pt-4 space-y-4">
            <div className="flex items-start gap-3 text-stone-400">
              <Info className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-lg">
                You will make your final choice in <span className="text-white">Human detection</span> stage
              </p>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              className="w-full h-14 text-lg font-medium bg-[#FD9A00] hover:bg-[#FD9A00]/90 text-stone-900"
            >
              Confirm
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameVoting;