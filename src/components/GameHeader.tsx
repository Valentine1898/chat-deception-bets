import { usePrivy, useWallets } from "@privy-io/react-auth";
import GameStageTimer from "./GameStageTimer";
import { GameStage } from "@/config/gameConfig";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatEther, Contract } from "ethers";
import { BrowserProvider } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { ACTIVE_NETWORK } from "@/config/networkConfig";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const TURING_TOKEN_ADDRESS = "0x158DF6e13E7Dd2B45e28168671Bd92990f4d0823";

type GameHeaderProps = {
  stage: GameStage;
  countdown: number | null;
  showTimer?: boolean;
};

const GameHeader = ({ stage, countdown }: GameHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, login } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string>("0.00");
  const [turingBalance, setTuringBalance] = useState<string>("0");
  const { toast } = useToast();
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  // Check if we're on an active game page (not the lobby)
  const isActiveGamePage = location.pathname.startsWith('/game/') && location.pathname.length > 6;
  
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
    const fetchBalances = async () => {
      if (wallets?.[0] && currentChainId === ACTIVE_NETWORK.chainId) {
        try {
          const ethProvider = await wallets[0].getEthereumProvider();
          const provider = new BrowserProvider(ethProvider);
          
          // Fetch ETH balance
          const ethBalance = await provider.getBalance(wallets[0].address);
          setBalance(parseFloat(formatEther(ethBalance)).toFixed(4));
          
          // Fetch TURING token balance
          const turingContract = new Contract(TURING_TOKEN_ADDRESS, ERC20_ABI, provider);
          const decimals = await turingContract.decimals();
          const turingBalance = await turingContract.balanceOf(wallets[0].address);
          
          // Convert BigInt to string first, then to number
          const divisor = BigInt(10) ** BigInt(decimals);
          const formattedBalance = Number(
            (Number(turingBalance.toString()) / Number(divisor.toString())).toFixed(2)
          );
          setTuringBalance(formattedBalance.toString());
        } catch (error) {
          console.error("Error fetching balances:", error);
          setBalance("0.00");
          setTuringBalance("0");
        }
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [wallets, currentChainId]);

  const formatLargeNumber = (num: string): string => {
    const value = parseFloat(num);
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(2);
  };

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#1C1917]">
      <div className="container mx-auto">
        <div className="flex flex-col items-start px-3 py-6">
            <div className="flex justify-between items-center w-full">
              <div 
                className="flex items-center gap-6 cursor-pointer" 
                onClick={() => navigate('/')}
              >
                <div className="relative w-[120px] h-[64px] rounded-xl border border-primary-foreground overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#4E2E25] to-[#372019]" />
                  <div className="absolute inset-0 flex items-end p-1.5">
                    <div className="flex gap-1">
                      <img 
                        src="/lovable-uploads/6afdfc38-7546-4743-8483-9dadaa0eb3a4.png" 
                        alt="Historical figure" 
                        className="w-[52px] h-[52px] rounded-lg border border-black object-cover"
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
                <h1 className="text-[32px] leading-[38px] font-bold font-['Inria_Serif'] text-[#F5F5F4]">
                  Turing Arena
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {!user?.wallet?.address ? (
                  <Button
                    onClick={login}
                    className="bg-[#FD9A00] hover:bg-[#FD9A00]/90 text-black font-medium px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </Button>
                ) : (
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
                      <span className="font-mono text-sm text-white">
                        {balance} ETH
                      </span>
                      <div className="w-px h-4 bg-[#292524]" />
                      <span className="font-mono text-sm text-white">
                        {formatLargeNumber(turingBalance)} TURING
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
                )}
              </div>
            </div>
        </div>
      </div>

      {location.pathname.startsWith('/game/') && location.pathname.length > 6 && (
        <GameStageTimer stage={stage} countdown={countdown} />
      )}
    </div>
  );
};

export default GameHeader;
