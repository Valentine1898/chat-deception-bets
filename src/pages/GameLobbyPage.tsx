import { useParams, Link } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import ShareGameButtons from "@/components/ShareGameButtons";
import PlayersList from "@/components/PlayersList";
import { generateAlias, shuffleArray } from "@/utils/playerUtils";
import { useEffect, useState } from "react";

// Mock data for AI players
const AI_PLAYERS = [
  { id: 'ai1', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai2', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai3', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai4', type: 'ai' as const, alias: generateAlias() },
];

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const { toast } = useToast();
  const { authenticated, user } = usePrivy();
  const [players, setPlayers] = useState<Array<any>>([]);

  const gameUrl = `${window.location.origin}/game/${gameId}`;

  // Mock data - in a real app this would come from your backend
  const mockGameData = {
    id: gameId,
    creatorAddress: "0x1234...5678", // This would be the actual creator's address
    betAmount: 0.1, // ETH
    status: "waiting_for_opponent",
    yourBet: authenticated ? 0.1 : 0, // Mock data - would come from backend
  };

  const isCreator = authenticated && user?.wallet?.address === mockGameData.creatorAddress;
  const hasPlacedBet = mockGameData.yourBet > 0;

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      // Initialize players with current user and AI players
      const currentPlayer = {
        id: user.wallet.address,
        type: 'human' as const,
        alias: generateAlias(),
        address: user.wallet.address
      };

      // For demo purposes, add one more human player
      const otherPlayer = {
        id: 'player2',
        type: 'human' as const,
        alias: generateAlias(),
        address: '0x7890...1234'
      };

      // Combine and shuffle all players
      const allPlayers = shuffleArray([currentPlayer, otherPlayer, ...AI_PLAYERS]);
      setPlayers(allPlayers);
    }
  }, [authenticated, user?.wallet?.address]);

  const placeBet = () => {
    toast({
      title: "Placing bet...",
      description: "This feature will be implemented with smart contracts",
    });
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 pt-24">
      <Link 
        to="/" 
        className="absolute top-24 left-4 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Games
      </Link>
      
      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
          alt="Alan Turing" 
          className="logo w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-foreground mb-2">Turing Arena</h1>
      </div>

      {!authenticated ? (
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
      ) : !hasPlacedBet ? (
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
                onClick={placeBet}
                className="bg-accent hover:bg-accent/90"
              >
                Place Bet
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted mb-6">
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

          <PlayersList 
            players={players}
            currentPlayerAddress={user?.wallet?.address}
          />
        </>
      )}
    </div>
  );
};

export default GameLobbyPage;