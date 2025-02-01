import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { usePrivy } from "@privy-io/react-auth";

// Mock contract functions
const mockContractCalls = {
  createGame: async (betAmount: string, walletAddress: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate contract response
    return {
      gameId: `game_${Math.random().toString(36).substr(2, 9)}`,
      betAmount,
      creator: walletAddress,
      timestamp: Date.now(),
    };
  }
};

const GameLobby = () => {
  const [betAmount, setBetAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { user } = usePrivy();
  
  const createGame = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      toast({
        title: "Invalid bet amount",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      
      // Call mock contract
      const result = await mockContractCalls.createGame(
        betAmount,
        user?.wallet?.address || ""
      );
      
      // Generate shareable link
      const gameUrl = `${window.location.origin}/game/${result.gameId}`;
      
      toast({
        title: "Game Created!",
        description: "Share this link with your opponent: " + gameUrl,
      });
      
      // Reset form
      setBetAmount("");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
      console.error("Game creation error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Create New Game</h2>
        <p className="text-muted-foreground">
          Set your bet amount and create a new game. Share the link with your opponent to start playing.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="betAmount" className="text-sm font-medium">
            Bet Amount (ETH)
          </label>
          <Input
            id="betAmount"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.1"
            min="0"
            step="0.01"
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={createGame}
          className="w-full"
          disabled={isCreating || !betAmount}
        >
          {isCreating ? "Creating..." : "Create Game"}
        </Button>
      </div>
    </div>
  );
};

export default GameLobby;