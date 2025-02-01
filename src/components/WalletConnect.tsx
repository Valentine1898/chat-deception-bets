import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

const WalletConnect = () => {
  const { login, authenticated, user } = usePrivy();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to the Human Detection Game
      </h1>
      {!authenticated ? (
        <Button 
          onClick={login}
          className="btn-primary text-lg"
        >
          Connect Wallet
        </Button>
      ) : (
        <div className="text-center animate-slide-up">
          <p className="mb-4">Connected as:</p>
          <code className="bg-muted px-4 py-2 rounded-lg">
            {user?.wallet?.address}
          </code>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;