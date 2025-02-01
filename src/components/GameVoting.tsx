import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
};

const GameVoting = ({ players, currentPlayerAddress, onVoteSubmit }: GameVotingProps) => {
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
    const newVotes: Record<string, 'human' | 'ai'> = {
      ...votes,
      [playerId]: isHuman ? 'human' : 'ai'
    };

    // If marking as human, mark all others as AI
    if (isHuman) {
      players.forEach(player => {
        if (player.id !== playerId && player.id !== currentPlayerAddress) {
          newVotes[player.id] = 'ai';
        }
      });
    }

    setVotes(newVotes);
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

  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Classify Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {players.map((player) => (
            player.id !== currentPlayerAddress && (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{player.alias}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVoteChange(player.id, true)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      votes[player.id] === 'human' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm">Human</span>
                  </button>
                  <button
                    onClick={() => handleVoteChange(player.id, false)}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                      votes[player.id] === 'ai' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Bot className="h-5 w-5" />
                    <span className="text-sm">AI</span>
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
        <Button
          className="w-full mt-4"
          onClick={handleSubmit}
          disabled={!canSubmit()}
        >
          Confirm Classifications
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameVoting;