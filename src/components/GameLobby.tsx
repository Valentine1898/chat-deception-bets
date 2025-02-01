import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Plus, Trophy, DollarSign, Loader2 } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { formatEther, parseEther } from "ethers";
import { v4 as uuidv4 } from 'uuid';

// Mock data - in a real app this would come from a database
const mockGames = [
  { 
    id: "game_9xkqp2m4r", 
    status: "completed", 
    createdAt: "2024-03-19",
    result: "win",
    winAmount: 100
  },
  { 
    id: "game_5tkl8n3p", 
    status: "completed", 
    createdAt: "2024-03-18",
    result: "loss",
    winAmount: 0
  }
];

const REQUIRED_BET = "0.1"; // ETH
const ACTIVE_GAME_SESSION_KEY = "activeGameSession";

const GameLobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [games] = useState(mockGames);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { wallets } = useWallets();
  const [activeGameSession, setActiveGameSession] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem(ACTIVE_GAME_SESSION_KEY);
    if (storedSession) {
      setActiveGameSession(storedSession);
    }
  }, []);

  const completedGames = games.filter(game => game.status === "completed");
  const totalWinnings = completedGames.reduce((total, game) => total + (game.winAmount || 0), 0);

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
        <img 
          src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
          alt="Alan Turing" 
          className="logo w-24 h-24 mx-auto mb-4"
        />
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Game History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Winnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.createdAt}</TableCell>
                    <TableCell className="capitalize">
                      <span className={game.result === 'win' ? 'text-green-500' : 'text-red-500'}>
                        {game.result}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      ${game.winAmount || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Total Winnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-4xl font-bold text-accent">${totalWinnings}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameLobby;