import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card className="fixed top-4 right-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in border-muted">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-accent" />
            <span className="text-sm font-mono text-foreground/80">
              {user?.wallet?.address ? shortenAddress(user.wallet.address) : "Not connected"}
            </span>
          </div>
          <div className="text-sm font-mono text-foreground/60">
            {balance} ETH
            {currentChainId !== BASE_CHAIN_ID && (
              <Button
                variant="outline"
                size="sm"
                onClick={checkAndSwitchNetwork}
                className="ml-2 text-xs"
              >
                Switch to Base
              </Button>
            )}
          </div>
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
    </Card>
  );
};

export default WalletWidget;