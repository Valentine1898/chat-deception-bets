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
import { useToast } from "@/hooks/use-toast";

// Base network configuration
const BASE_CHAIN_ID = "0x2105"; // Chain ID for Base network
const BASE_NETWORK = {
  chainId: BASE_CHAIN_ID,
  chainName: "Base",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

type GameHeaderProps = {
  stage: GameStage;
  countdown: number | null;
};

const GameHeader = ({ stage, countdown }: GameHeaderProps) => {
  const { logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string>("0.00");
  const { toast } = useToast();
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);
  
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-3)}`; // Showing fewer characters
  };

  const checkAndSwitchNetwork = async () => {
    if (wallets?.[0]) {
      try {
        const provider = await wallets[0].getEthereumProvider();
        const chainId = await provider.request({ method: 'eth_chainId' });
        setCurrentChainId(chainId);

        if (chainId !== BASE_CHAIN_ID) {
          try {
            // Try to switch to Base network
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: BASE_CHAIN_ID }],
            });
            toast({
              title: "Network switched",
              description: "Successfully switched to Base network",
            });
          } catch (switchError: any) {
            // If the network is not added to the wallet, add it
            if (switchError.code === 4902) {
              try {
                await provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [BASE_NETWORK],
                });
                toast({
                  title: "Network added",
                  description: "Base network has been added to your wallet",
                });
              } catch (addError) {
                console.error("Error adding network:", addError);
                toast({
                  title: "Error",
                  description: "Failed to add Base network to your wallet",
                  variant: "destructive",
                });
              }
            } else {
              console.error("Error switching network:", switchError);
              toast({
                title: "Error",
                description: "Failed to switch to Base network",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking network:", error);
      }
    }
  };

  useEffect(() => {
    checkAndSwitchNetwork();
    // Check network every 30 seconds
    const interval = setInterval(checkAndSwitchNetwork, 30000);
    return () => clearInterval(interval);
  }, [wallets]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallets?.[0] && currentChainId === BASE_CHAIN_ID) {
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
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [wallets, currentChainId]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative bg-card p-2 rounded-xl shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/6afdfc38-7546-4743-8483-9dadaa0eb3a4.png" 
                      alt="Historical figure" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <img src="/avatars/1.svg" alt="" className="w-6 h-6" />
                    <img src="/avatars/2.svg" alt="" className="w-6 h-6" />
                    <img src="/avatars/3.svg" alt="" className="w-6 h-6" />
                    <img src="/avatars/4.svg" alt="" className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <h1 className="text-lg font-bold text-foreground">Turing Arena</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-lg text-xs">
                <div className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-accent" />
                  <span className="font-mono text-foreground/80">
                    {user?.wallet?.address ? shortenAddress(user.wallet.address) : "Not connected"}
                  </span>
                </div>
                <div className="font-mono text-foreground/60">
                  {balance} ETH
                  {currentChainId !== BASE_CHAIN_ID && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkAndSwitchNetwork}
                      className="ml-1.5 text-xs py-0.5 h-6"
                    >
                      Switch to Base
                    </Button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/30 border-b border-muted">
        <div className="container mx-auto py-1.5">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Games
          </Link>
        </div>
      </div>

      <GameStageTimer stage={stage} countdown={countdown} />
    </div>
  );
};

export default GameHeader;