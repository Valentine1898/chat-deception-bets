import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GameResultsProps = {
  isWinner: boolean;
  prizeAmount: string;
};

const GameResults = ({ isWinner, prizeAmount }: GameResultsProps) => {
  const navigate = useNavigate();

  const handleClaimPrize = () => {
    // For now just navigate home
    navigate('/');
  };

  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
        {isWinner ? (
          <>
            <Trophy className="w-16 h-16 text-yellow-500" />
            <h2 className="text-3xl font-bold text-foreground">You Won!</h2>
            <p className="text-xl text-muted-foreground">
              Congratulations! You've won {prizeAmount} ETH
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-3xl font-bold text-foreground">You Lost</h2>
            <p className="text-xl text-muted-foreground">
              Better luck next time!
            </p>
          </>
        )}
        <Button 
          onClick={handleClaimPrize}
          className="bg-primary hover:bg-primary/90"
        >
          {isWinner ? 'Claim Prize' : 'Return Home'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameResults;