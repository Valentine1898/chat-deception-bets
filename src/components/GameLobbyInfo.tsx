import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ShareGameButtons from "@/components/ShareGameButtons";
import WalletConnect from "@/components/WalletConnect";

type GameLobbyInfoProps = {
  authenticated: boolean;
  hasPlacedBet: boolean;
  isCreator: boolean;
  gameId: string;
  gameUrl: string;
  mockGameData: {
    betAmount: number;
  };
  onPlaceBet: () => void;
  onSimulatePlayerJoin: () => void;
};

const GameLobbyInfo = ({
  authenticated,
  hasPlacedBet,
  isCreator,
  gameId,
  gameUrl,
  mockGameData,
  onPlaceBet,
  onSimulatePlayerJoin
}: GameLobbyInfoProps) => {
  if (!authenticated) {
    return (
      <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Connect Your Wallet to Join
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <WalletConnect />
        </CardContent>
      </Card>
    );
  }

  if (!hasPlacedBet) {
    return (
      <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Place Your Bet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg mb-4">
              Required bet amount: {mockGameData.betAmount} ETH
            </p>
            <Button 
              onClick={onPlaceBet}
              className="bg-accent hover:bg-accent/90"
            >
              Place Bet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-foreground">
          Game Lobby
        </CardTitle>
        <p className="text-xl text-muted-foreground animate-pulse">
          {isCreator ? "Waiting for opponent to join..." : "Waiting for game to start..."}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted/50 p-4 text-center border border-muted">
          <p className="text-sm font-medium text-muted-foreground mb-2">Game ID</p>
          <p className="text-lg font-mono text-accent">{gameId}</p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onSimulatePlayerJoin}
            className="bg-accent hover:bg-accent/90"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Simulate Player Join
          </Button>
        </div>

        <ShareGameButtons gameUrl={gameUrl} />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {isCreator 
              ? "The game will start automatically when your opponent joins and places their bet"
              : "The game will start automatically when both players have placed their bets"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameLobbyInfo;