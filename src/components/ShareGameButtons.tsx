import { Copy, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ShareGameButtonsProps {
  gameUrl: string;
}

const ShareGameButtons = ({ gameUrl }: ShareGameButtonsProps) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default ShareGameButtons;