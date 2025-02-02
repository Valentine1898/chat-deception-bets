import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
    <Card className="fixed top-4 right-4 p-4 glass-card animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-accent" />
            <span className="text-sm font-mono text-foreground">
              {user?.wallet?.address ? shortenAddress(user.wallet.address) : "Not connected"}
            </span>
          </div>
          <div className="text-sm font-mono text-foreground/60">
            {balance} ETH
            {currentChainId !== ACTIVE_NETWORK.chainId && (
              <Button
                variant="outline"
                size="sm"
                onClick={checkAndSwitchNetwork}
                className="ml-2 text-xs bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
              >
                Switch to {ACTIVE_NETWORK.chainName}
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-foreground/60 hover:text-foreground hover:bg-primary/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default WalletWidget;