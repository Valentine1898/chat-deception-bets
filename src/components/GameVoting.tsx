import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Bot } from "lucide-react";

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
  onVoteChange: (playerId: string, isAI: boolean) => void;
};

const GameVoting = ({ players, currentPlayerAddress, onVoteChange }: GameVotingProps) => {
  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Vote: Who is AI?
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      onCheckedChange={(checked) => onVoteChange(player.id, checked as boolean)}
                    />
                    <Bot className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">AI</span>
                  </label>
                </div>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameVoting;