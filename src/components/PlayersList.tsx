import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bot } from "lucide-react";

type Player = {
  id: string;
  type: 'human' | 'ai';
  alias: string;
  address?: string;
  hasJoined?: boolean;
};

type PlayersListProps = {
  players: Player[];
  currentPlayerAddress?: string;
};

const PlayersList = ({ players, currentPlayerAddress }: PlayersListProps) => {
  return (
    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          Players ({players.length}/6)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                {player.type === 'human' ? (
                  <User className="h-5 w-5 text-accent" />
                ) : (
                  <Bot className="h-5 w-5 text-accent" />
                )}
                <span className="font-medium">
                  {player.type === 'human' ? (
                    player.address && player.hasJoined ? (
                      <>
                        {player.address.slice(0, 6)}...{player.address.slice(-4)}
                        {player.address === currentPlayerAddress && " (You)"}
                      </>
                    ) : (
                      "Waiting for player..."
                    )
                  ) : (
                    "AI Agent"
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayersList;