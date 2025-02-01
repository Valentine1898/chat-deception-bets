import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Plus, Trophy, DollarSign } from "lucide-react";

// Mock data - in a real app this would come from a database
const mockGames = [
  { 
    id: "game_7dgzpbxu9", 
    status: "active", 
    createdAt: "2024-03-20",
    result: "pending"
  },
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

const GameLobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [games] = useState(mockGames);

  const activeGame = games.find(game => game.status === "active");
  const completedGames = games.filter(game => game.status === "completed");
  const totalWinnings = completedGames.reduce((total, game) => total + (game.winAmount || 0), 0);

  const createGame = () => {
    const gameId = `game_${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/game/${gameId}`);
  };

  const joinGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
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

      {activeGame ? (
        <Card className="bg-accent/10 backdrop-blur supports-[backdrop-filter]:bg-accent/5 border-accent mb-8 hover:bg-accent/20 transition-colors cursor-pointer"
             onClick={() => joinGame(activeGame.id)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-accent">Active Game</CardTitle>
            <Button onClick={(e) => {
              e.stopPropagation();
              joinGame(activeGame.id);
            }} className="bg-accent hover:bg-accent/90">
              <Play className="mr-2 h-5 w-5" />
              Continue Game
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground mb-2">Game ID: <span className="font-mono">{activeGame.id}</span></p>
            <p className="text-lg text-muted-foreground">Started: {activeGame.createdAt}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">No Active Games</CardTitle>
            <Button onClick={createGame} className="bg-accent hover:bg-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              New Game
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Start a new game to begin playing!</p>
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