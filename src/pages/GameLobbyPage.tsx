import { useParams, useNavigate } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/hooks/use-toast";
import PlayersList from "@/components/PlayersList";
import GameHeader from "@/components/GameHeader";
import GameTopic from "@/components/GameTopic";
import GameChat from "@/components/GameChat";
import GameLobbyInfo from "@/components/GameLobbyInfo";
import { GAME_TIMINGS } from "@/config/gameConfig";
import { wsService } from "@/services/websocket";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const GAME_TOPICS = [
  {
    title: "The Future of Artificial Intelligence",
    description: "Discuss the potential impact of AI on society, ethics, and human development in the next 50 years."
  },
  {
    title: "Climate Change Solutions",
    description: "Explore innovative approaches to combat global warming and create sustainable futures."
  },
  {
    title: "Space Colonization",
    description: "Debate the challenges and opportunities of establishing human settlements on Mars and beyond."
  }
];

const GameLobbyPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authenticated, user } = usePrivy();
  const [players, setPlayers] = useState<Array<any>>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [topicRevealCountdown, setTopicRevealCountdown] = useState<number | null>(null);
  const [chatCountdown, setChatCountdown] = useState<number | null>(null);
  const [votingCountdown, setVotingCountdown] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<typeof GAME_TOPICS[0] | null>(null);
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

  useEffect(() => {
    if (gameId && authenticated && user?.wallet?.address) {
      wsService.connect(gameId);

      const unsubscribeSessionInfo = wsService.onSessionInfo((sessionInfo) => {
        const currentPlayer = {
          id: sessionInfo.you,
          type: 'human' as const,
          alias: sessionInfo.you,
          address: user.wallet.address,
          hasJoined: true
        };

        const otherPlayers = sessionInfo.players
          .filter(playerId => playerId !== sessionInfo.you)
          .map(playerId => ({
            id: playerId,
            type: 'human' as const,
            alias: playerId,
            hasJoined: true
          }));

        setPlayers([currentPlayer, ...otherPlayers]);
      });

      return () => {
        unsubscribeSessionInfo();
        wsService.disconnect();
      };
    }
  }, [gameId, authenticated, user?.wallet?.address]);

  const handleGameStart = () => {
    setIsGameStarted(true);
    setSelectedTopic(GAME_TOPICS[Math.floor(Math.random() * GAME_TOPICS.length)]);
    setTopicRevealCountdown(GAME_TIMINGS.TOPIC_REVIEW);
  };

  const getCurrentStage = () => {
    if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
      return "topic_review" as const;
    }
    if (chatCountdown !== null && chatCountdown > 0) {
      return "chat" as const;
    }
    if (votingCountdown !== null && votingCountdown > 0) {
      return hasVoted ? "awaiting_votes" : "voting";
    }
    if (votingCountdown === 0) {
      return "results" as const;
    }
    return "waiting" as const;
  };

  const getCurrentCountdown = () => {
    if (topicRevealCountdown !== null) return topicRevealCountdown;
    if (chatCountdown !== null) return chatCountdown;
    if (votingCountdown !== null) return votingCountdown;
    return null;
  };

  // Topic reveal countdown
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
      // Mock smart contract interaction for claiming prize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the game session from localStorage
      localStorage.removeItem("activeGameSession");
      
      toast({
        title: "Prize claimed successfully!",
        description: "You can now start a new game.",
      });
      
      // Redirect to home page
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

  if (isGameStarted) {
    const stage = getCurrentStage();
    
    return (
      <div className="container mx-auto p-6 pt-32 relative">
        <GameHeader 
          stage={stage}
          countdown={getCurrentCountdown()}
        />
        
        <div className="flex gap-6 relative mt-8">
          <div className="w-1/3">
            <PlayersList 
              players={players}
              currentPlayerAddress={user?.wallet?.address}
              isInGame={true}
              showResults={stage === 'results'}
            />
          </div>
          <div className="w-2/3">
            <GameTopic 
              topic={selectedTopic}
              isChatVisible={stage === 'chat' || stage === 'voting' || stage === 'awaiting_votes'}
            />
            {isChatVisible && <GameChat />}
          </div>
        </div>

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
    );
  }

  return (
    <div className="container mx-auto p-6 pt-32 relative">
      <GameHeader 
        stage="waiting"
        countdown={null}
      />
      <div className="flex gap-6 relative mt-8">
        <div className="w-1/3">
          <PlayersList 
            players={players}
            currentPlayerAddress={user?.wallet?.address}
            onGameStart={handleGameStart}
            isInGame={isGameStarted}
          />
        </div>
        <div className="w-2/3">
          <GameLobbyInfo 
            authenticated={authenticated}
            hasPlacedBet={hasPlacedBet}
            isCreator={isCreator}
            gameId={gameId || ''}
            gameUrl={gameUrl}
            mockGameData={mockGameData}
            onPlaceBet={() => {
              toast({
                title: "Placing bet...",
                description: "This would trigger a smart contract call in production",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLobbyPage;
