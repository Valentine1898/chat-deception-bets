import { useParams } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/components/ui/use-toast";
import PlayersList from "@/components/PlayersList";
import GameHeader from "@/components/GameHeader";
import GameTopic from "@/components/GameTopic";
import GameVoting from "@/components/GameVoting";
import GameLobbyInfo from "@/components/GameLobbyInfo";
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

  const getCurrentStage = () => {
    if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
      return "topic_review" as const;
    }
    if (chatCountdown !== null && chatCountdown > 0) {
      return "chat" as const;
    }
    if (votingCountdown !== null && votingCountdown > 0) {
      return "voting" as const;
    }
    return "waiting" as const;
  };

  const getCurrentCountdown = () => {
    if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
      return topicRevealCountdown;
    }
    if (chatCountdown !== null && chatCountdown > 0) {
      return chatCountdown;
    }
    if (votingCountdown !== null && votingCountdown > 0) {
      return votingCountdown;
    }
    return null;
  };

  const handleGameStart = () => {
    const shuffledPlayers = shuffleArray(players);
    setPlayers(shuffledPlayers);
    setSelectedTopic(GAME_TOPICS[Math.floor(Math.random() * GAME_TOPICS.length)]);
    setIsGameStarted(true);
    setTopicRevealCountdown(GAME_TIMINGS.TOPIC_REVIEW);
  };

  const placeBet = () => {
    toast({
      title: "Placing bet...",
      description: "This feature will be implemented with smart contracts",
    });
  };

  const simulatePlayerJoin = () => {
    const newPlayer = {
      id: `player_${Date.now()}`,
      type: 'human' as const,
      alias: generateAlias(),
      address: `0x${Math.random().toString(16).slice(2, 10)}`,
      hasJoined: true
    };
    setPlayers(current => [...current, newPlayer]);
    toast({
      title: "New player joined!",
      description: `${newPlayer.alias} has joined the game.`,
    });
  };

  const handleVoteSubmit = (votes: Record<string, 'human' | 'ai'>) => {
    // Mock contract call
    console.log('Submitting votes to contract:', votes);
    toast({
      title: "Votes submitted to contract",
      description: "This would trigger a smart contract call in production",
    });
  };

  if (isGameStarted) {
    return (
      <div className="container mx-auto p-6 pt-24 relative">
        <GameHeader 
          stage={getCurrentStage()}
          countdown={getCurrentCountdown()}
        />
        <div className="flex gap-6 relative mt-8">
          <div className="w-1/3">
            {isVotingVisible ? (
              <GameVoting 
                players={players}
                currentPlayerAddress={user?.wallet?.address}
                onVoteSubmit={handleVoteSubmit}
              />
            ) : (
              <PlayersList 
                players={players}
                currentPlayerAddress={user?.wallet?.address}
                isInGame={true}
              />
            )}
          </div>
          <div className="w-2/3">
            <GameTopic 
              topic={selectedTopic}
              isChatVisible={isChatVisible || isVotingVisible}
            />
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
