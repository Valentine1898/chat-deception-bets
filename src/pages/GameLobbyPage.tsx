import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {usePrivy, useWallets} from "@privy-io/react-auth";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import PlayersList from "@/components/PlayersList";
import GameTopic from "@/components/GameTopic";
import GameChat from "@/components/GameChat";
import GameLobbyInfo from "@/components/GameLobbyInfo";
import WaitingComponent from "@/components/WaitingComponent";
import GameResults from "@/components/GameResults";
import {GAME_TIMINGS} from "@/config/gameConfig";
import {Player, wsService} from "@/services/websocket";
import {contractService} from "@/services/contractService.ts";
import {y} from "@privy-io/react-auth/dist/dts/types-Cj9jWnPs";

const GameLobbyPage = () => {
    const {gameId} = useParams();
    const navigate = useNavigate();
    const {toast} = useToast();
    const {authenticated, user} = usePrivy();

    // Game state
    const [players, setPlayers] = useState<Array<{
        id: number,
        type: string,
        alias: string,
        hasJoined: boolean
        address?: string
    }>>([]);
    const {wallets} = useWallets();
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<{ title: string; description: string } | null>(null);

    // Timer states
    const [topicRevealCountdown, setTopicRevealCountdown] = useState<number | null>(null);
    const [chatCountdown, setChatCountdown] = useState<number | null>(null);
    const [votingCountdown, setVotingCountdown] = useState<number | null>(null);

    // UI states
    const [isVotingVisible, setIsVotingVisible] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [prizeAmount, setPrizeAmount] = useState("0");

    const gameUrl = `${window.location.origin}/game/${gameId}`;

    const mockGameData = {
        id: gameId,
        creatorAddress: "0xDC89F9576281e87f78EeF7ddDEBD61f7e7D82f82",
        betAmount: 0.1,
        status: "waiting_for_opponent",
        yourBet: authenticated ? 0.1 : 0,
    };

    const isCreator = authenticated && user?.wallet?.address === mockGameData.creatorAddress;
    const hasPlacedBet = mockGameData.yourBet > 0;

    useEffect(() => {
        if (gameId && authenticated) {
            wsService.connect(gameId);

            const unsubscribeSessionInfo = wsService.onSessionInfo((sessionInfo) => {
                console.log('Received session info:', sessionInfo);
                const you = sessionInfo.players.find(player => player.name === sessionInfo.you);

                console.log('currentPlayer', you)
                const otherPlayers = sessionInfo.players
                    .filter(player => player.name !== sessionInfo.you)
                    .map(playerId => ({
                        id: playerId.id,
                        type: 'human',
                        alias: playerId.name,
                        hasJoined: true,
                    }));

                setPlayers([{
                    id: you.id, type: 'human', alias: you.name, hasJoined: true, address: user?.wallet?.address,
                }, ...otherPlayers]);
            });

            const unsubscribeTopicMessage = wsService.onTopicMessage((topic) => {
                console.log('Received topic:', topic);
                handleGameStart()
                setSelectedTopic({
                    title: "Today's Topic",
                    description: topic
                });
            });

            const unsubscribeSessionStart = wsService.onSessionStart(() => {
                console.log('Session started, transitioning to Discussion phase');
                setIsGameStarted(true);
                setChatCountdown(GAME_TIMINGS.CHAT_DISCUSSION);
            });

            const unsubscribeSessionValidated = wsService.onSessionValidated(async () => {
                console.log('Session validated, checking game results');
                try {
                    if (wallets?.[0]) {
                        const provider = await wallets[0].getEthereumProvider();
                        await contractService.init(provider);
                        const gameData = await contractService.getGameData(parseInt(gameId));

                        // Determine if current user is winner
                        const currentUserAddress = wallets[0].address.toLowerCase();
                        const player1Address = gameData.player1.addr.toLowerCase();
                        const player2Address = gameData.player2.addr.toLowerCase();

                        const player1Won = gameData.player1.guessed;
                        const player2Won = gameData.player2.guessed;

                        // Calculate if current user won
                        const userIsPlayer1 = currentUserAddress === player1Address;
                        setIsWinner(userIsPlayer1 ? player1Won : player2Won);

                        // Set prize amount (total bet amount)
                        const totalPrize = (parseFloat(gameData.bet.toString()) * 2) / 1e18;
                        setPrizeAmount(totalPrize.toString());

                        setShowResults(true);
                    }
                } catch (error) {
                    console.error('Error checking game results:', error);
                    toast({
                        title: "Error checking results",
                        description: "There was an error checking the game results.",
                        variant: "destructive"
                    });
                }
            });

            return () => {
                unsubscribeSessionInfo();
                unsubscribeTopicMessage();
                unsubscribeSessionStart();
                unsubscribeSessionValidated();
                wsService.disconnect();
            };
        }
    }, [gameId, authenticated, user?.wallet?.address]);

    const handleJoinGame = async () => {
        try {
            setHasJoined(true);
            wsService.requestTopic()

            toast({
                title: "Successfully joined the game!",
                description: "Your bet has been placed.",
            });
        } catch (error) {
            console.error("Error joining game:", error);
            toast({
                title: "Error joining game",
                description: "There was an error placing your bet. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleGameStart = () => {
        console.log('Starting game...');
        setIsGameStarted(true);
        setTopicRevealCountdown(GAME_TIMINGS.TOPIC_REVIEW);
    };

    const getCurrentStage = () => {
        if (showResults) {
            return "results";
        }
        if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
            return "topic_discovery";
        }
        if (chatCountdown !== null && chatCountdown > 0) {
            return "discussion";
        }
        if (votingCountdown !== null && votingCountdown > 0) {
            return hasVoted ? "awaiting_votes" : "human_detection";
        }
        if (votingCountdown === 0) {
            return "results";
        }
        return "waiting";
    };

    const getCurrentCountdown = () => {
        if (topicRevealCountdown !== null) return topicRevealCountdown;
        if (chatCountdown !== null) return chatCountdown;
        if (votingCountdown !== null) return votingCountdown;
        return null;
    };

    const handleVoteSubmit = async (votes: Record<number, 'human' | 'ai'>) => {
        console.log('Submitting votes:', votes);
        const human = votes
        let idToVote = 0;
        for (const key of Object.keys(votes)) {
            if (votes[key] === 'human') {
                idToVote = parseInt(key)
            }
        }
        const provider = await wallets[0].getEthereumProvider();
        await contractService.init(provider);

        await contractService.vote(parseInt(gameId), idToVote);
        console.log(`${wallets[0].address} | voted: ${idToVote}`)
        toast({
            title: "Votes submitted",
            description: "Your votes have been recorded.",
        });
    };

    // Topic countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
            if (topicRevealCountdown === GAME_TIMINGS.TOPIC_REVIEW) {
                wsService.requestTopic();
            }

            timer = setTimeout(() => {
                setTopicRevealCountdown(topicRevealCountdown - 1);
            }, 1000);
        } else if (topicRevealCountdown === 0) {
            setTopicRevealCountdown(null);
            wsService.startSession();
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [topicRevealCountdown]);

    // Chat countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (chatCountdown !== null && chatCountdown > 0) {
            timer = setTimeout(() => {
                setChatCountdown(chatCountdown - 1);
            }, 1000);
        } else if (chatCountdown === 0) {
            setIsVotingVisible(true);
            setVotingCountdown(GAME_TIMINGS.VOTING);
            setChatCountdown(null);
            toast({
                title: "Discussion ended!",
                description: "Time to vote on who you think is AI.",
            });
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [chatCountdown, toast]);

    // Voting countdown
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (votingCountdown !== null && votingCountdown > 0) {
            timer = setTimeout(() => {
                setVotingCountdown(votingCountdown - 1);
            }, 1000);
        } else if (votingCountdown === 0) {
            setVotingCountdown(null);
            toast({
                title: "Voting ended!",
                description: "Results will be revealed soon.",
            });
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [votingCountdown, toast]);

    const handleClaimPrize = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            localStorage.removeItem("activeGameSession");
            toast({
                title: "Prize claimed successfully!",
                description: "You can now start a new game.",
            });
            navigate('/');
        } catch (error) {
            console.error("Error claiming prize:", error);
            toast({
                title: "Error claiming prize",
                description: "There was an error claiming your prize. Please try again.",
                variant: "destructive"
            });
        }
    };

    const stage = getCurrentStage();
    const shouldShowChat = stage === 'discussion' || stage === 'human_detection' || stage === 'awaiting_votes';

    if (stage === "results") {
        return (
            <div className="min-h-screen bg-stone-800">
                <div className="container mx-auto p-6">
                    <GameResults isWinner={isWinner} prizeAmount={prizeAmount}/>
                </div>
            </div>
        );
    }

    if (isGameStarted) {
        return (
            <div className="min-h-screen bg-stone-800">
                <div className="container mx-auto p-6">
                    <div className="flex gap-6 justify-between">
                        <div className="flex-1">
                            {stage === 'waiting' ? (
                                <WaitingComponent/>
                            ) : (
                                <GameTopic
                                    topic={selectedTopic}
                                    isChatVisible={shouldShowChat}
                                    gameId={gameId}
                                    prizePool="0.0005"
                                />
                            )}

                            {showResults && (
                                <div className="flex flex-col items-center justify-center mt-8">
                                    <h2 className="text-2xl font-bold mb-4">Game Results</h2>
                                    <Button
                                        onClick={handleClaimPrize}
                                        className="bg-accent hover:bg-accent/90"
                                    >
                                        Claim Prize
                                    </Button>
                                </div>
                            )}
                        </div>
                        <PlayersList
                            players={players}
                            currentPlayerAddress={user?.wallet?.address}
                            isInGame={true}
                            showResults={showResults}
                            stage={stage}
                            onVoteSubmit={handleVoteSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-800">
            <div className="container mx-auto p-6">
                <div className="flex gap-6 justify-between">
                    <div className="flex-1">
                        <GameLobbyInfo
                            authenticated={authenticated}
                            hasPlacedBet={hasPlacedBet}
                            isCreator={isCreator}
                            gameId={gameId || ''}
                            gameUrl={gameUrl}
                            mockGameData={{
                                betAmount: mockGameData.betAmount
                            }}
                            onPlaceBet={handleJoinGame}
                        />
                    </div>
                    <PlayersList
                        players={players}
                        currentPlayerAddress={user?.wallet?.address}
                        onGameStart={handleGameStart}
                        isInGame={isGameStarted}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameLobbyPage;
