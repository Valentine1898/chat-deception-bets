import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const GameLobby = () => {
  const [betAmount, setBetAmount] = useState("");
  const { toast } = useToast();
  
  const createGame = async () => {
    try {
      // TODO: Implement smart contract interaction
      toast({
        title: "Game Created!",
        description: "Share the link with your opponent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="game-container animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center">Game Lobby</h2>
      
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block mb-2">Bet Amount (ETH)</label>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.1"
            className="input-field"
          />
        </div>
        
        <Button 
          onClick={createGame}
          className="btn-primary w-full"
        >
          Create New Game
        </Button>
      </div>
    </div>
  );
};

export default GameLobby;