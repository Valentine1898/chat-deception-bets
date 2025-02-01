import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Plus } from "lucide-react";

// В реальному додатку ці дані мають зберігатися в базі даних
const mockGames = [
  { id: "game_7dgzpbxu9", status: "waiting", createdAt: "2024-03-20" },
  { id: "game_9xkqp2m4r", status: "in_progress", createdAt: "2024-03-19" },
];

const GameLobby = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [games] = useState(mockGames);

  const createGame = () => {
    const gameId = `game_${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/game/${gameId}`);
  };

  const joinGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Your Games</CardTitle>
          <Button onClick={createGame} className="bg-accent hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-mono">{game.id}</TableCell>
                  <TableCell className="capitalize">{game.status.replace('_', ' ')}</TableCell>
                  <TableCell>{game.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => joinGame(game.id)}
                      className="border-muted hover:bg-muted/50"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Join
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {games.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No games found. Create a new game to get started!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GameLobby;