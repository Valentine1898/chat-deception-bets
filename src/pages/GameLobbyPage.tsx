import { useParams } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/components/ui/use-toast";
import PlayersList from "@/components/PlayersList";
import GameHeader from "@/components/GameHeader";
import GameTopic from "@/components/GameTopic";
import GameVoting from "@/components/GameVoting";
import GameLobbyInfo from "@/components/GameLobbyInfo";
import GameResults from "@/components/GameResults";
import { generateAlias, shuffleArray } from "@/utils/playerUtils";
import { useEffect, useState } from "react";
import { GAME_TIMINGS } from "@/config/gameConfig";

// Mock topics - in a real app these would come from an API
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

// Mock data for AI players
const AI_PLAYERS = [
  { id: 'ai1', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai2', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai3', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai4', type: 'ai' as const, alias: generateAlias() },
];

const GameLobbyPage = () => {
  const { gameId } = useParams();
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
  const [aiPlayerIndex, setAiPlayerIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [gameResult, setGameResult] = useState<'win' | 'draw' | 'lose' | 'ai_win'>('win');
  const [hasVoted, setHasVoted] = useState(false);

  const gameUrl = `${window.location.origin}/game/${gameId}`;

  // Mock data - in a real app this would come from your backend
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
    if (authenticated && user?.wallet?.address) {
      const currentPlayer = {
        id: user.wallet.address,
        type: 'human' as const,
        alias: generateAlias(),
        address: user.wallet.address,
        hasJoined: true
      };

      setPlayers([currentPlayer]);
    }
  }, [authenticated, user?.wallet?.address]);

  // Add AI players one by one
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const humanPlayers = players.filter(p => p.type === 'human' && p.hasJoined);

    if (humanPlayers.length === 2 && aiPlayerIndex < AI_PLAYERS.length) {
      timer = setTimeout(() => {
        setPlayers(current => [...current, AI_PLAYERS[aiPlayerIndex]]);
        setAiPlayerIndex(prev => prev + 1);
      }, GAME_TIMINGS.AI_PLAYER_INTERVAL);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [players, aiPlayerIndex]);

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
      toast({
        title: "Voting ended!",
        description: "Results will be revealed soon.",
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [votingCountdown, toast]);

  const handleVoteChange = (playerId: string, isAI: boolean) => {
    setVotes(prev => ({
      ...prev,
      [playerId]: isAI
    }));
  };

  const handleVoteSubmit = (votes: Record<string, 'human' | 'ai'>) => {
    console.log('Submitting votes to contract:', votes);
    setHasVoted(true);
    toast({
      title: "Votes submitted to contract",
      description: "Waiting for other players to vote...",
    });
  };

  // Test function to cycle through results
  const cycleGameResult = () => {
    const results: Array<'win' | 'draw' | 'lose' | 'ai_win'> = ['win', 'draw', 'lose', 'ai_win'];
    const currentIndex = results.indexOf(gameResult);
    const nextIndex = (currentIndex + 1) % results.length;
    setGameResult(results[nextIndex]);
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

  // Mock vote results for testing
  const mockVoteResults = players.map(player => ({
    player,
    actualType: player.type,
    votedAs: Math.random() > 0.5 ? 'human' : 'ai'
  }));

  if (isGameStarted) {
    const currentStage = getCurrentStage();
    
    return (
      <div className="container mx-auto p-6 pt-24 relative">
        <GameHeader 
          stage={currentStage}
          countdown={getCurrentCountdown()}
        />
        
        {/* Test controls - only for development */}
        {currentStage === 'results' && (
          <Button onClick={cycleGameResult} className="mb-4">
            Test Next Result
          </Button>
        )}

        <div className="flex gap-6 relative mt-8">
          <div className="w-1/3">
            {currentStage === 'results' ? (
              <PlayersList 
                players={players}
                currentPlayerAddress={user?.wallet?.address}
                isInGame={true}
              />
            ) : (
              <GameVoting 
                players={players}
                currentPlayerAddress={user?.wallet?.address}
                onVoteSubmit={handleVoteSubmit}
                showConfirmButton={currentStage === 'voting'}
              />
            )}
          </div>
          <div className="w-2/3">
            {currentStage === 'results' ? (
              <GameResults
                result={gameResult}
                playerVotes={mockVoteResults}
                currentPlayerAddress={user?.wallet?.address}
              />
            ) : (
              <GameTopic 
                topic={selectedTopic}
                isChatVisible={currentStage === 'chat' || currentStage === 'voting' || currentStage === 'awaiting_votes'}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24 relative">
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
            onPlaceBet={placeBet}
            onSimulatePlayerJoin={simulatePlayerJoin}
          />
        </div>
      </div>
    </div>
  );
};

export default GameLobbyPage;
