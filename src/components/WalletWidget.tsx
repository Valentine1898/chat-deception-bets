import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { BrowserProvider } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { ACTIVE_NETWORK } from "@/config/networkConfig";

const WalletWidget = () => {
  const { user, logout } = usePrivy();
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

        if (chainId !== ACTIVE_NETWORK.chainId) {
          try {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ACTIVE_NETWORK.chainId }],
            });
            toast({
              title: "Network switched",
              description: `Successfully switched to ${ACTIVE_NETWORK.chainName} network`,
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [ACTIVE_NETWORK],
                });
                toast({
                  title: "Network added",
                  description: `${ACTIVE_NETWORK.chainName} network has been added to your wallet`,
                });
              } catch (addError) {
                console.error("Error adding network:", addError);
                toast({
                  title: "Error",
                  description: `Failed to add ${ACTIVE_NETWORK.chainName} network to your wallet`,
                  variant: "destructive",
                });
              }
            } else {
              console.error("Error switching network:", switchError);
              toast({
                title: "Error",
                description: `Failed to switch to ${ACTIVE_NETWORK.chainName} network`,
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
      if (wallets?.[0] && currentChainId === ACTIVE_NETWORK.chainId) {
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
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#1C1917]">
        <div className="container mx-auto">
          <div className="flex flex-col items-start px-3 py-6">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-6">
                <h1 className="text-[32px] leading-[38px] font-bold font-['Inria_Serif'] text-[#F5F5F4]">
                  Turing Arena
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#1C1917] rounded-xl p-2">
                  <div className="flex items-center gap-2.5 px-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="mask0_23_5268" maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
                        <path d="M0 0H12V12H0V0Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask0_23_5268)">
                        <path d="M5.9895 12C9.309 12 12 9.31369 12 6C12 2.68631 9.309 0 5.9895 0C2.84016 0 0.256594 2.418 0 5.49563H7.94447V6.50437H0C0.256594 9.582 2.84016 12 5.9895 12Z" fill="#3A77F7"/>
                      </g>
                    </svg>
                    <span className="font-['Chivo_Mono'] text-sm text-white">
                      {balance} ETH
                    </span>
                    <div className="w-px h-4 bg-[#292524]" />
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3 h-3 text-[#D6D3D1]" />
                      <span className="font-['Chivo_Mono'] text-sm text-primary">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletWidget;
