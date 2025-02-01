import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Wallet } from "lucide-react";

const WalletWidget = () => {
  const { user, logout } = usePrivy();
  
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="fixed top-4 right-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono">
            {user?.wallet?.address ? shortenAddress(user.wallet.address) : "Not connected"}
          </span>
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