import { usePrivy } from "@privy-io/react-auth";
import WalletConnect from "@/components/WalletConnect";
import GameLobby from "@/components/GameLobby";

const Index = () => {
  const { authenticated } = usePrivy();

  return (
    <div className="min-h-screen">
      {!authenticated ? <WalletConnect /> : <GameLobby />}
    </div>
  );
};

export default Index;