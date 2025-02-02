import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Plus, Loader2, Info } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { parseEther, formatEther } from "ethers";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import { contractService } from "@/services/contractService";

const ACTIVE_GAME_SESSION_KEY = "activeGameSession";

const BET_OPTIONS = [
  { amount: "0.001", label: "ETH", usdValue: "$3.27" },
  { amount: "0.01", label: "ETH", usdValue: "$32.7" },
  { amount: "0.1", label: "ETH", usdValue: "$327.3" },
];

const GameLobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { wallets } = useWallets();
  const [activeGameSession, setActiveGameSession] = useState<string | null>(null);
  const [selectedBet, setSelectedBet] = useState(BET_OPTIONS[0]);

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
      
      // Initialize contract with current provider
      await contractService.init(await wallets[0].getEthereumProvider());
      
      // Create game on the contract
      const gameId = await contractService.createGame(selectedBet.amount);
      
      // Store game session
      localStorage.setItem(ACTIVE_GAME_SESSION_KEY, gameId.toString());
      setActiveGameSession(gameId.toString());
      
      toast({
        title: "Game created successfully!",
        description: `Your bet of ${selectedBet.amount} ETH has been placed.`,
      });
      
      navigate(`/game/${gameId}`);
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

  const joinGame = async (sessionId: string) => {
    if (!wallets?.[0]) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to join the game",
        variant: "destructive"
      });
      return;
    }

    try {
      // Initialize contract with current provider
      await contractService.init(await wallets[0].getEthereumProvider());
      
      // Join game on the contract
      await contractService.joinGame(parseInt(sessionId), selectedBet.amount);
      
      localStorage.setItem(ACTIVE_GAME_SESSION_KEY, sessionId);
      setActiveGameSession(sessionId);
      
      toast({
        title: "Joined game successfully!",
        description: `Your bet of ${selectedBet.amount} ETH has been placed.`,
      });
      
      navigate(`/game/${sessionId}`);
    } catch (error) {
      console.error("Error joining game:", error);
      toast({
        title: "Error joining game",
        description: "There was an error joining the game. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 mt-24">
      <Card className="bg-[#1C1917] border-none shadow-2xl">
        <CardContent className="p-8">
          <div className="mb-12">
            <img 
              src="/lovable-uploads/f11be65f-04d6-4461-a829-da3a007e9734.png" 
              alt="Turing machine" 
              className="w-full h-48 object-cover rounded-xl mb-6"
            />
            <h1 className="text-3xl font-serif text-white mb-8">Create new chatroom</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg text-gray-300 mb-4">Select bet</h2>
                <div className="grid grid-cols-3 gap-4">
                  {BET_OPTIONS.map((bet) => (
                    <button
                      key={bet.amount}
                      onClick={() => setSelectedBet(bet)}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200",
                        selectedBet.amount === bet.amount
                          ? "bg-white border-white"
                          : "bg-[#292524] border-[#44403B] hover:border-white/50"
                      )}
                    >
                      <div className={cn(
                        "text-lg font-mono",
                        selectedBet.amount === bet.amount ? "text-black" : "text-white"
                      )}>
                        {bet.amount} {bet.label}
                      </div>
                      <div className={cn(
                        "text-sm font-mono",
                        selectedBet.amount === bet.amount ? "text-black/60" : "text-white/60"
                      )}>
                        {bet.usdValue}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#A8A29E] bg-black/20 p-4 rounded-xl">
                <Info className="h-5 w-5 text-[#FD9A00]" />
                <p className="text-sm">
                  Your opponent have to bet the same amount in order to start game, so total prize pool will be equal 2 bets
                </p>
              </div>

              <Button 
                onClick={createGame}
                disabled={isPlacingBet}
                className="w-full py-6 text-lg bg-[#FD9A00] hover:bg-[#FD9A00]/90 text-black"
              >
                {isPlacingBet ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Placing Bet...
                  </>
                ) : (
                  "Create game"
                )}
              </Button>
            </div>
          </div>

          {activeGameSession && (
            <Card className="bg-accent/10 backdrop-blur supports-[backdrop-filter]:bg-accent/5 border-accent hover:bg-accent/20 transition-colors cursor-pointer"
                 onClick={() => joinGame(activeGameSession)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-accent">Active Game</h3>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      joinGame(activeGameSession);
                    }} 
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Continue Game
                  </Button>
                </div>
                <p className="text-xl text-muted-foreground mb-2">
                  Session ID: <span className="font-mono">{activeGameSession}</span>
                </p>
                <p className="text-lg text-muted-foreground">Share this link to invite players:</p>
                <code className="block mt-2 p-2 bg-muted rounded text-sm">
                  {`${window.location.origin}/game/${activeGameSession}`}
                </code>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameLobby;
