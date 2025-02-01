import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const { toast } = useToast();

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Game Lobby</h2>
        <p className="text-muted-foreground">
          Waiting for opponent to join...
        </p>
        <p className="text-sm text-muted-foreground">
          Game ID: {gameId}
        </p>
      </div>
    </div>
  );
};

export default GameLobbyPage;