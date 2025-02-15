import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Check, Info, Copy, Loader2} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import WalletConnect from "@/components/WalletConnect";
import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { contractService } from "@/services/contractService";

type GameLobbyInfoProps = {
    authenticated: boolean;
    hasPlacedBet: boolean;
    isCreator: boolean;
    gameId: string;
    gameUrl: string;
    mockGameData: {
        betAmount: number;
        creatorAddress?: string;
    };
    onPlaceBet: () => void;
};

const GameLobbyInfo = ({
    authenticated,
    hasPlacedBet,
    isCreator,
    gameId,
    gameUrl,
    mockGameData,
    onPlaceBet
}: GameLobbyInfoProps) => {
    const {toast} = useToast();
    const { wallets } = useWallets();
    const userAddress = wallets?.[0]?.address?.toLowerCase();
    const [isLoading, setIsLoading] = useState(true);
    const [gameData, setGameData] = useState<{
        bet: string;
        creatorAddress: string;
    } | null>(null);
    
    useEffect(() => {
        const fetchGameData = async () => {
            try {
                if (gameId && wallets?.[0]) {
                    setIsLoading(true);
                    const provider = await wallets[0].getEthereumProvider();
                    await contractService.init(provider);
                    const data = await contractService.getGameData(parseInt(gameId));
                    if (data) {
                        setGameData({
                            bet: data.bet.toString(),
                            creatorAddress: data.player1.addr.toLowerCase()
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching game data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameData();
    }, [gameId, wallets]);

    const creatorAddress = gameData?.creatorAddress?.toLowerCase();
    const betAmount = gameData ? parseFloat(gameData.bet) / 1e18 : mockGameData.betAmount;
    const isActualCreator = userAddress && creatorAddress && userAddress === creatorAddress;

    const copyGameUrl = async () => {
        try {
            await navigator.clipboard.writeText(gameUrl);
            toast({
                title: "Link Copied!",
                description: "The game invitation link has been copied to your clipboard.",
            });
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please try copying the link manually.",
                variant: "destructive",
            });
        }
    };

    const handleJoinGame = async () => {
        if (!wallets?.[0]) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to join the game",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsLoading(true);
            // Initialize contract with current provider
            const provider = await wallets[0].getEthereumProvider();
            await contractService.init(provider);
            
            // Join game on the contract
            await contractService.joinGame(parseInt(gameId), betAmount.toString());
            
            // Call onPlaceBet which will handle any additional UI updates
            onPlaceBet();
            
            toast({
                title: "Successfully joined the game!",
                description: `Your bet of ${betAmount} ETH has been placed.`,
            });
        } catch (error) {
            console.error("Error joining game:", error);
            toast({
                title: "Error joining game",
                description: "There was an error joining the game. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!authenticated) {
        return (
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Connect Your Wallet to Join
                    </h2>
                    <WalletConnect/>
                </CardContent>
            </Card>
        );
    }

    if (!hasPlacedBet) {
        return (
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Place Your Bet
                    </h2>
                    <p className="text-lg mb-4">
                        Required bet amount: {betAmount} ETH
                    </p>
                    <Button
                        onClick={handleJoinGame}
                        className="bg-accent hover:bg-accent/90"
                    >
                        Place Bet
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <h2 className="text-2xl font-bold text-foreground">
                        Loading game data...
                    </h2>
                </CardContent>
            </Card>
        );
    }

    return (
        isActualCreator ? (
            <div className="space-y-6 w-full max-w-2xl mx-auto">
                <div className="relative">
                    <img
                        src="/lovable-uploads/f11be65f-04d6-4461-a829-da3a007e9734.png"
                        alt="Turing machine"
                        className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl"/>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-white">Game successfully created</h1>
                        <Check className="w-6 h-6 text-accent"/>
                    </div>
                </div>

                <Card className="bg-[#1C1917] border-[#292524]">
                    <CardContent className="p-6 space-y-4">
                        <div>
                            <h2 className="text-xl text-white">Chatroom • Prize Pool <span
                                className="text-primary">{betAmount * 2} ETH</span></h2>
                            <p className="text-sm text-muted-foreground">
                                id: <span className="font-mono">{gameId}</span>
                            </p>
                        </div>

                        <div className="flex items-start gap-3 bg-black/20 rounded-xl p-4">
                            <Info className="w-5 h-5 text-primary mt-0.5"/>
                            <p className="text-sm text-[#A8A29E]">
                                In this version we don't have public lobby, so share it in your chats or friend and try to
                                find opponent there
                            </p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={gameUrl}
                                readOnly
                                className="flex-1 bg-black/20 border border-muted rounded-xl px-4 py-2 text-sm text-muted-foreground"
                            />
                            <Button
                                onClick={copyGameUrl}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                <Copy className="w-4 h-4 mr-2"/>
                                Copy link
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        ) : (
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
                                Chatroom • Prize Pool <span className="text-[#FD9A00]">{betAmount * 2} ETH</span>
                            </h2>
                            <p className="text-sm text-[#A8A29E]">
                                id: <span className="font-mono">{gameId}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#A8A29E] bg-black/20 p-4 rounded-xl">
                        <Info className="h-5 w-5 text-[#FD9A00]"/>
                        <p className="text-sm">
                            You will need to have {betAmount} ETH on your wallet to make your bet
                        </p>
                    </div>

                    {authenticated ? (
                        <Button
                            onClick={handleJoinGame}
                            className="w-full py-6 text-lg bg-[#FD9A00] hover:bg-[#FD9A00]/90 text-black font-serif italic"
                        >
                            Join game for {betAmount} ETH
                        </Button>
                    ) : (
                        <WalletConnect/>
                    )}
                </CardContent>
            </Card>
        )
    );
};

export default GameLobbyInfo;