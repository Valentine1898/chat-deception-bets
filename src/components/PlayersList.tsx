import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  onGameStart?: () => void;
};

const PlayersList = ({ players, currentPlayerAddress, onGameStart }: PlayersListProps) => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const humanPlayers = players.filter(p => p.type === 'human' && p.hasJoined);

  useEffect(() => {
    // Check if both human players have joined
    if (humanPlayers.length === 2 && !isCountingDown) {
      // Notify about opponent joining
      const opponent = humanPlayers.find(p => p.address !== currentPlayerAddress);
      if (opponent) {
        toast({
          title: "Opponent joined!",
          description: `${opponent.address?.slice(0, 6)}...${opponent.address?.slice(-4)} has joined the game.`,
        });
      }

      // Start countdown - reduced from 10 to 3 seconds
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
      // Game starts
      onGameStart?.();
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown, onGameStart]);

  return (
    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          Players ({players.length}/6)
          {countdown !== null && countdown > 0 && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              Game starts in {countdown}s
            </span>
          )}
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