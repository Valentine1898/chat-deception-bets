import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bot, CircleUser, CheckCircle2, XCircle } from "lucide-react";
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

  const renderPlayerInfo = (player: Player) => {
    if (showResults) {
      return (
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">
            {player.alias}
            {player.address === currentPlayerAddress && " (You)"}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800">
              <span className="text-sm">Voted as:</span>
              {player.votedAsHuman ? (
                <div className="flex items-center gap-1 text-green-600">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Human</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-purple-600">
                  <Bot className="h-4 w-4" />
                  <span className="text-sm">AI</span>
                </div>
              )}
            </div>
            {player.type === 'human' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
        </div>
      );
    }

    if (isInGame) {
      return (
        <span className="font-medium">
          {player.alias}
          {player.address === currentPlayerAddress && " (You)"}
        </span>
      );
    }

    return (
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
    );
  };

  return (
    <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          {showResults ? "Game Results" : `Players (${players.length}/6)`}
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
              <div className="flex items-center gap-3 w-full">
                {isInGame ? (
                  <CircleUser className="h-5 w-5 text-accent" />
                ) : (
                  player.type === 'human' ? (
                    <User className="h-5 w-5 text-accent" />
                  ) : (
                    <Bot className="h-5 w-5 text-accent" />
                  )
                )}
                {renderPlayerInfo(player)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayersList;