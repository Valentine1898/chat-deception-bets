import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";

const EnhancedWalletWidget = () => {
  const { user, logout } = usePrivy();
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
          const balance = await ethProvider.getBalance(wallets[0].address);
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

export default EnhancedWalletWidget;