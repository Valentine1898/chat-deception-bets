import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import { usePrivy } from "@privy-io/react-auth";

type GameJoinScreenProps = {
  gameId: string;
  prizePool: string;
  requiredBet: string;
  onJoinGame: () => void;
};

const GameJoinScreen = ({ gameId, prizePool, requiredBet, onJoinGame }: GameJoinScreenProps) => {
  const { authenticated } = usePrivy();

  return (
    <Card className="max-w-md mx-auto bg-[#1C1917] border-none">
      <CardContent className="p-6 space-y-6">
        <img
          src="/lovable-uploads/f11be65f-04d6-4461-a829-da3a007e9734.png"
          alt="Turing machine"
          className="w-full h-48 object-cover rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-serif text-white mb-2">
            Do you want to join?
          </h1>

          <div className="space-y-2">
            <h2 className="text-xl text-white">
              Chatroom • Prize Pool <span className="text-[#FD9A00]">{prizePool} ETH</span>
            </h2>
            <p className="text-sm text-[#A8A29E]">
              id: <span className="font-mono">{gameId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#A8A29E] bg-black/20 p-4 rounded-xl">
          <Info className="h-5 w-5 text-[#FD9A00]" />
          <p className="text-sm">
            You will need to have {requiredBet} ETH on your wallet to make your bet
          </p>
        </div>

        {authenticated ? (
          <Button
            onClick={onJoinGame}
            className="w-full py-6 text-lg bg-[#FD9A00] hover:bg-[#FD9A00]/90 text-black font-serif italic"
          >
            Join game for {requiredBet} ETH
          </Button>
        ) : (
          <WalletConnect />
        )}
      </CardContent>
    </Card>
  );
};

export default GameJoinScreen;