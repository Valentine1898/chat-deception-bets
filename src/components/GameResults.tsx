import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, MinusCircle, XCircle, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type GameResult = 'win' | 'draw' | 'lose' | 'ai_win';

type Player = {
  id: string;
  type: 'human' | 'ai';
  alias: string;
  address?: string;
  hasJoined?: boolean;
};

type PlayerVoteResult = {
  player: Player;
  actualType: 'human' | 'ai';
  votedAs: 'human' | 'ai';
};

type GameResultsProps = {
  result: GameResult;
  playerVotes: PlayerVoteResult[];
  currentPlayerAddress?: string;
};

const GameResults = ({ result, playerVotes, currentPlayerAddress }: GameResultsProps) => {
  const { toast } = useToast();

  const handleClaimPrize = () => {
    toast({
      title: "Claiming prize...",
      description: "This would trigger a smart contract call in production",
    });
  };

  const handleWithdrawBet = () => {
    toast({
      title: "Withdrawing bet...",
      description: "This would trigger a smart contract call in production",
    });
  };

  const getResultContent = () => {
    switch (result) {
      case 'win':
        return {
          icon: <Trophy className="h-12 w-12 text-yellow-500" />,
          title: "Congratulations! You Won!",
          description: "You correctly identified all AI players.",
          action: (
            <Button onClick={handleClaimPrize} className="w-full mt-4">
              Claim Prize
            </Button>
          ),
          bgColor: "bg-green-500/10"
        };
      case 'draw':
        return {
          icon: <MinusCircle className="h-12 w-12 text-blue-500" />,
          title: "It's a Draw",
          description: "Both players made some mistakes.",
          action: (
            <Button onClick={handleWithdrawBet} className="w-full mt-4">
              Withdraw Bet
            </Button>
          ),
          bgColor: "bg-blue-500/10"
        };
      case 'lose':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: "You Lost",
          description: "Your opponent made better choices.",
          action: null,
          bgColor: "bg-red-500/10"
        };
      case 'ai_win':
        return {
          icon: <Bot className="h-12 w-12 text-purple-500" />,
          title: "AI Outsmarted Everyone!",
          description: "Both players failed to identify the AI correctly.",
          action: null,
          bgColor: "bg-purple-500/10"
        };
    }
  };

  const resultContent = getResultContent();

  return (
    <div className="space-y-6">
      <Card className={`${resultContent.bgColor} border-none`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {resultContent.icon}
            <h2 className="text-2xl font-bold">{resultContent.title}</h2>
            <p className="text-muted-foreground">{resultContent.description}</p>
            {resultContent.action}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voting Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {playerVotes.map((vote) => (
              <div
                key={vote.player.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {vote.player.alias}
                    {vote.player.address === currentPlayerAddress && " (You)"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    vote.actualType === vote.votedAs 
                      ? 'bg-green-500/20 text-green-700'
                      : 'bg-red-500/20 text-red-700'
                  }`}>
                    Voted: {vote.votedAs.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 rounded text-sm bg-primary/20">
                    Actually: {vote.actualType.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameResults;