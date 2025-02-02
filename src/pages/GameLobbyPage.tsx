import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import PlayersList from "@/components/PlayersList";
import GameHeader from "@/components/GameHeader";
import GameTopic from "@/components/GameTopic";
import GameLobbyInfo from "@/components/GameLobbyInfo";
import GameJoinScreen from "@/components/GameJoinScreen";
import { GAME_TIMINGS } from "@/config/gameConfig";
import { wsService } from "@/services/websocket";

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authenticated, user } = usePrivy();
  
  // Game state
  const [players, setPlayers] = useState<Array<any>>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<{ title: string; description: string } | null>(null);
  
  // Timer states
  const [topicRevealCountdown, setTopicRevealCountdown] = useState<number | null>(null);
  const [chatCountdown, setChatCountdown] = useState<number | null>(null);
  const [votingCountdown, setVotingCountdown] = useState<number | null>(null);
  
  // UI states
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isVotingVisible, setIsVotingVisible] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const gameUrl = `${window.location.origin}/game/${gameId}`;

  const mockGameData = {
    id: gameId,
    creatorAddress: "0x1234...5678",
    betAmount: 0.1,
    status: "waiting_for_opponent",
    yourBet: authenticated ? 0.1 : 0,
  };

  const isCreator = authenticated && user?.wallet?.address === mockGameData.creatorAddress;
  const hasPlacedBet = mockGameData.yourBet > 0;

  const handleGameStart = () => {
    setIsGameStarted(true);
    setTopicRevealCountdown(GAME_TIMINGS.TOPIC_REVEAL);
  };

  useEffect(() => {
    if (gameId && authenticated) {
      wsService.connect(gameId);

      const unsubscribeSessionInfo = wsService.onSessionInfo((sessionInfo) => {
        console.log('Received session info:', sessionInfo);
        const currentPlayer = {
          id: sessionInfo.you,
          type: 'human',
          alias: sessionInfo.you,
          address: user?.wallet?.address,
          hasJoined: true
        };

        const otherPlayers = sessionInfo.players
          .filter(playerId => playerId !== sessionInfo.you)
          .map(playerId => ({
            id: playerId,
            type: 'human',
            alias: playerId,
            hasJoined: true
          }));

        setPlayers([currentPlayer, ...otherPlayers]);
      });

      const unsubscribeTopicMessage = wsService.onTopicMessage((topic) => {
        console.log('Received topic:', topic);
        setSelectedTopic({
          title: "Today's Topic",
          description: topic
        });
      });

      return () => {
        unsubscribeSessionInfo();
        unsubscribeTopicMessage();
        wsService.disconnect();
      };
    }
  }, [gameId, authenticated, user?.wallet?.address]);

  const handleJoinGame = async () => {
    try {
      // Mock smart contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasJoined(true);
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

  const getCurrentStage = () => {
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

  const handleVoteSubmit = (votes: Record<string, 'human' | 'ai'>) => {
    console.log('Submitting votes:', votes);
    setHasVoted(true);
    toast({
      title: "Votes submitted",
      description: "Your votes have been recorded.",
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
      timer = setTimeout(() => {
        setTopicRevealCountdown(topicRevealCountdown - 1);
      }, 1000);
    } else if (topicRevealCountdown === 0) {
      setIsChatVisible(true);
      setChatCountdown(GAME_TIMINGS.CHAT_DISCUSSION);
      setTopicRevealCountdown(null);
      wsService.startSession(); // Start session when topic review ends
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
      setIsChatVisible(false);
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

  // Show join screen if user hasn't joined and isn't the creator
  if (!hasJoined && !isCreator && gameId) {
    return (
      <div className="min-h-screen bg-stone-800 pt-24">
        <GameHeader stage="waiting" countdown={null} />
        <div className="container mx-auto p-6">
          <GameJoinScreen
            gameId={gameId}
            prizePool="0.0005"
            requiredBet="0.00025"
            onJoinGame={handleJoinGame}
          />
        </div>
      </div>
    );
  }

  if (isGameStarted) {
    const stage = getCurrentStage();
    
    return (
      <div className="min-h-screen bg-stone-800">
        <div className="fixed top-0 left-0 right-0 z-50">
          <GameHeader 
            stage={stage}
            countdown={getCurrentCountdown()}
          />
        </div>
        
        <div className="container mx-auto p-6 mt-[200px]">
          <div className="flex gap-6 justify-between">
            <div className="flex-1">
              <GameTopic 
                topic={selectedTopic}
                isChatVisible={stage === 'discussion' || stage === 'human_detection' || stage === 'awaiting_votes'}
                gameId={gameId}
                prizePool="0.0005"
              />
              
              {stage === 'results' && (
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
              showResults={stage === 'results'}
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
      <div className="fixed top-0 left-0 right-0 z-50">
        <GameHeader 
          stage="waiting"
          countdown={null}
        />
      </div>
      <div className="container mx-auto p-6 mt-[200px]">
        <div className="flex gap-6 justify-between">
          <div className="flex-1">
            <GameLobbyInfo 
              authenticated={authenticated}
              hasPlacedBet={hasPlacedBet}
              isCreator={isCreator}
              gameId={gameId || ''}
              gameUrl={gameUrl}
              mockGameData={{
                betAmount: 0.00025
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
