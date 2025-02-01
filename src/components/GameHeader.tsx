import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import GameStageTimer from "./GameStageTimer";
import { GameStage } from "@/config/gameConfig";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { BrowserProvider } from "ethers";

type GameHeaderProps = {
  stage: GameStage;
  countdown: number | null;
};

const GameHeader = ({ stage, countdown }: GameHeaderProps) => {
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string>("0.00");
  
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallets?.[0]) {
        try {
          const ethProvider = await wallets[0].getEthereumProvider();
          const provider = new BrowserProvider(ethProvider);
          const balance = await provider.getBalance(wallets[0].address);
          setBalance(parseFloat(formatEther(balance)).toFixed(4));
        } catch (error) {
          console.error("Error fetching balance:", error);
          setBalance("0.00");
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [wallets]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main header */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-muted">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
                alt="Alan Turing" 
                className="w-10 h-10"
              />
              <h1 className="text-xl font-bold text-foreground">Turing Arena</h1>
            </div>

            <div className="flex items-center gap-4">
              <GameStageTimer 
                stage={stage}
                countdown={countdown}
              />
              <div className="flex items-center gap-4 bg-muted/20 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-accent" />
                  <span className="text-sm font-mono text-foreground/80">
                    {user?.wallet?.address ? shortenAddress(user.wallet.address) : "Not connected"}
                  </span>
                </div>
                <div className="text-sm font-mono text-foreground/60">
                  {balance} ETH
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subheader */}
      <div className="bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30 border-b border-muted">
        <div className="container mx-auto py-2">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;