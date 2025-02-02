import { usePrivy } from "@privy-io/react-auth";
import GameLobby from "@/components/GameLobby";
import GameHeader from "@/components/GameHeader";

const Index = () => {
  const { authenticated } = usePrivy();

  return (
    <div className="min-h-screen bg-stone-800">
      {authenticated && <GameHeader stage="waiting" countdown={null} />}
      <GameLobby />
    </div>
  );
};

export default Index;