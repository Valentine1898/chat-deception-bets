import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Plus, Loader2 } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { parseEther } from "ethers";
import { v4 as uuidv4 } from 'uuid';

const REQUIRED_BET = "0.1"; // ETH
const ACTIVE_GAME_SESSION_KEY = "activeGameSession";

const GameLobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { wallets } = useWallets();
  const [activeGameSession, setActiveGameSession] = useState<string | null>(null);

  useEffect(() => {
    // Clear session on page load/refresh
    localStorage.removeItem(ACTIVE_GAME_SESSION_KEY);
    setActiveGameSession(null);

    // Then check if there's a session in the URL that we should restore
    const pathParts = window.location.pathname.split('/');
    const gameIdFromUrl = pathParts[2]; // /game/:gameId
    
    if (gameIdFromUrl) {
      setActiveGameSession(gameIdFromUrl);
      localStorage.setItem(ACTIVE_GAME_SESSION_KEY, gameIdFromUrl);
    }
  }, []);

  const clearGameSession = () => {
    localStorage.removeItem(ACTIVE_GAME_SESSION_KEY);
    setActiveGameSession(null);
  };

  const createGame = async () => {
    if (!wallets?.[0]) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a game",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPlacingBet(true);
      
      // Mock smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate blockchain delay
      
      // In reality, this would be a smart contract call
      // const contract = new ethers.Contract(address, abi, signer);
      // await contract.createGame({ value: parseEther(REQUIRED_BET) });
      
      const sessionId = uuidv4();
      localStorage.setItem(ACTIVE_GAME_SESSION_KEY, sessionId);
      setActiveGameSession(sessionId);
      
      toast({
        title: "Bet placed successfully!",
        description: `Your bet of ${REQUIRED_BET} ETH has been placed.`,
      });
      
      navigate(`/game/${sessionId}`);
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Error creating game",
        description: "There was an error placing your bet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  const joinGame = (sessionId: string) => {
    localStorage.setItem(ACTIVE_GAME_SESSION_KEY, sessionId);
    setActiveGameSession(sessionId);
    navigate(`/game/${sessionId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 mt-24">
      <div className="text-center mb-8">
        <div className="inline-block bg-card p-4 rounded-2xl shadow-lg mb-6">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <img 
                src="/lovable-uploads/a79d497b-4457-44d5-ae6f-6af3390f246b.png" 
                alt="Alan Turing" 
                className="w-32 h-32 rounded-xl object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <img src="/avatars/1.svg" alt="" className="w-10 h-10" />
              <img src="/avatars/2.svg" alt="" className="w-10 h-10" />
              <img src="/avatars/3.svg" alt="" className="w-10 h-10" />
              <img src="/avatars/4.svg" alt="" className="w-10 h-10" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Turing Arena</h1>
      </div>

      {activeGameSession ? (
        <Card className="bg-accent/10 backdrop-blur supports-[backdrop-filter]:bg-accent/5 border-accent mb-8 hover:bg-accent/20 transition-colors cursor-pointer"
             onClick={() => joinGame(activeGameSession)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-accent">Active Game</CardTitle>
            <Button onClick={(e) => {
              e.stopPropagation();
              joinGame(activeGameSession);
            }} className="bg-accent hover:bg-accent/90">
              <Play className="mr-2 h-5 w-5" />
              Continue Game
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground mb-2">Session ID: <span className="font-mono">{activeGameSession}</span></p>
            <p className="text-lg text-muted-foreground">Share this link to invite players:</p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`${window.location.origin}/game/${activeGameSession}`}
            </code>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Start New Game</CardTitle>
            <Button 
              onClick={createGame} 
              className="bg-accent hover:bg-accent/90"
              disabled={isPlacingBet}
            >
              {isPlacingBet ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Bet...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Place {REQUIRED_BET} ETH Bet
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Place a bet of {REQUIRED_BET} ETH to start a new game
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameLobby;