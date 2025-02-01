import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Twitter } from "lucide-react";
import WalletWidget from "@/components/WalletWidget";

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const { toast } = useToast();

  const gameUrl = `${window.location.origin}/game/${gameId}`;

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
    const tweetText = encodeURIComponent(`Join my game! ${gameUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
      <WalletWidget />
      
      <img 
        src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
        alt="Alan Turing" 
        className="logo mb-8 w-24 h-24 object-cover"
      />
      
      <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-foreground">
            Game Lobby
          </CardTitle>
          <p className="text-xl text-muted-foreground animate-pulse">
            Waiting for opponent to join...
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4 text-center border border-muted">
            <p className="text-sm font-medium text-muted-foreground mb-2">Game ID</p>
            <p className="text-lg font-mono text-accent">{gameId}</p>
          </div>

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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              The game will start automatically when your opponent joins
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameLobbyPage;