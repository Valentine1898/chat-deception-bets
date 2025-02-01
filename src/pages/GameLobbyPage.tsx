import { usePrivy } from "@privy-io/react-auth";
import { useParams } from "react-router-dom";
import WalletConnect from "@/components/WalletConnect";
import PlayersList from "@/components/PlayersList";
import { Card } from "@/components/ui/card";

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const { authenticated, user } = usePrivy();

  if (!authenticated) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <WalletConnect />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Players List - Left Side */}
        <div className="md:col-span-1">
          <PlayersList 
            players={[
              { id: '1', type: 'human', address: user?.wallet?.address, hasJoined: true },
              { id: '2', type: 'human', address: undefined, hasJoined: false },
              { id: '3', type: 'ai', alias: 'AI Agent' },
              { id: '4', type: 'ai', alias: 'AI Agent' },
              { id: '5', type: 'ai', alias: 'AI Agent' },
              { id: '6', type: 'ai', alias: 'AI Agent' }
            ]}
            currentPlayerAddress={user?.wallet?.address}
          />
        </div>

        {/* Game Lobby - Right Side */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <div className="text-center mb-8">
              <img 
                src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
                alt="Alan Turing" 
                className="w-24 h-24 mx-auto mb-4"
              />
              <h1 className="text-3xl font-bold text-foreground mb-2">Game Lobby</h1>
              <p className="text-muted-foreground">Game ID: {gameId}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameLobbyPage;