import { useParams, Link } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Twitter, ArrowLeft } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const { toast } = useToast();
  const { authenticated, user } = usePrivy();

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

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
      toast({
        title: "Link Copied!",
        description: "The game invitation link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`Join my game in Turing Arena! ${gameUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const placeBet = () => {
    // This would integrate with your smart contract
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

            {isCreator && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Share this game with your opponent:
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={copyInviteLink}
                    variant="outline"
                    className="flex-1 max-w-[200px] border-muted hover:bg-muted/50"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    onClick={shareOnTwitter}
                    variant="outline"
                    className="flex-1 max-w-[200px] border-muted hover:bg-muted/50"
                  >
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on Twitter
                  </Button>
                </div>
              </div>
            )}

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
      )}
    </div>
  );
};

export default GameLobbyPage;