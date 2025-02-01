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
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  const checkAndSwitchNetwork = async () => {
    if (wallets?.[0]) {
      try {
        const provider = await wallets[0].getEthereumProvider();
        const chainId = await provider.request({ method: 'eth_chainId' });
        setCurrentChainId(chainId);

        if (chainId !== "0x2105") {
          try {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: "0x2105" }],
            });
            toast({
              title: "Network switched",
              description: "Successfully switched to Base network",
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: "0x2105",
                    chainName: "Base",
                    nativeCurrency: {
                      name: "ETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: ["https://mainnet.base.org"],
                    blockExplorerUrls: ["https://basescan.org"],
                  }],
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
    const interval = setInterval(checkAndSwitchNetwork, 30000);
    return () => clearInterval(interval);
  }, [wallets]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallets?.[0] && currentChainId === "0x2105") {
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
        <div className="container mx-auto">
          <div className="flex flex-col items-start px-3 py-6 gap-1">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-6">
                <div className="relative w-[120px] h-[64px] rounded-xl border border-primary-foreground overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#4E2E25] to-[#372019]" />
                  <div className="absolute inset-0 flex items-end p-1.5">
                    <div className="flex gap-1">
                      <img 
                        src="/lovable-uploads/6afdfc38-7546-4743-8483-9dadaa0eb3a4.png" 
                        alt="Historical figure" 
                        className="w-13 h-13 rounded-lg border border-black object-cover"
                      />
                      <div className="grid grid-cols-2 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-[#0C0A09]/70 p-0.5">
                            <img src={`/avatars/${i}.svg`} alt="" className="w-full h-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl font-bold font-['Inria_Serif'] text-[#F5F5F4]">
                  Turing Arena
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#1C1917] rounded-xl p-2">
                  <div className="flex items-center gap-2.5 px-2">
                    <img src="/base.svg" alt="Base" className="w-3 h-3" />
                    <span className="font-mono text-sm text-white">
                      {balance} ETH
                    </span>
                    <div className="w-px h-4 bg-[#292524]" />
                    <span className="font-mono text-sm text-white">
                      1.54M TURING
                    </span>
                    <div className="w-px h-4 bg-[#292524]" />
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3 h-3 text-[#D6D3D1]" />
                      <span className="font-mono text-sm text-primary">
                        {user?.wallet?.address ? shortenAddress(user.wallet.address) : "Not connected"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="ml-2 bg-primary hover:bg-primary/90 h-8 w-8 p-0"
                  >
                    <LogOut className="h-4 w-4 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <Link 
                to="/" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Back to Games
              </Link>
            </div>
          </div>
        </div>
      </div>

      <GameStageTimer stage={stage} countdown={countdown} />
    </div>
  );
};

export default GameHeader;
