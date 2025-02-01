import { useParams } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/components/ui/use-toast";
import PlayersList from "@/components/PlayersList";
import GameHeader from "@/components/GameHeader";
import GameTopic from "@/components/GameTopic";
import GameLobbyInfo from "@/components/GameLobbyInfo";
import { generateAlias, shuffleArray } from "@/utils/playerUtils";
import { useEffect, useState } from "react";

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
  const [selectedTopic, setSelectedTopic] = useState<typeof GAME_TOPICS[0] | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);

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

  // Topic reveal countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (topicRevealCountdown !== null && topicRevealCountdown > 0) {
      timer = setTimeout(() => {
        setTopicRevealCountdown(topicRevealCountdown - 1);
      }, 1000);
    } else if (topicRevealCountdown === 0) {
      setIsChatVisible(true);
      setChatCountdown(180); // 3 minutes in seconds
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
      toast({
        title: "Time's up!",
        description: "The discussion has ended.",
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [chatCountdown, toast]);

  const simulatePlayerJoin = () => {
    const mockPlayer = {
      id: 'player2',
      type: 'human' as const,
      alias: generateAlias(),
      address: '0x7890...1234',
      hasJoined: true
    };

    setPlayers(current => {
      const updatedPlayers = [...current, mockPlayer];
      return updatedPlayers;
    });

    toast({
      title: "Player joined!",
      description: "Starting countdown...",
    });
  };

  const handleGameStart = () => {
    const allPlayers = [...players, ...AI_PLAYERS];
    const shuffledPlayers = shuffleArray(allPlayers);
    setPlayers(shuffledPlayers);
    setSelectedTopic(GAME_TOPICS[Math.floor(Math.random() * GAME_TOPICS.length)]);
    setIsGameStarted(true);
    setTopicRevealCountdown(5);
  };

  const placeBet = () => {
    toast({
      title: "Placing bet...",
      description: "This feature will be implemented with smart contracts",
    });
  };

  if (isGameStarted) {
    return (
      <div className="container mx-auto p-6 pt-24 relative">
        <GameHeader />
        <div className="flex gap-6 relative mt-8">
          <div className="w-1/3">
            <PlayersList 
              players={players}
              currentPlayerAddress={user?.wallet?.address}
              isInGame={true}
            />
          </div>
          <div className="w-2/3">
            <GameTopic 
              topic={selectedTopic}
              topicRevealCountdown={topicRevealCountdown}
              chatCountdown={chatCountdown}
              isChatVisible={isChatVisible}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24 relative">
      <GameHeader />
      <div className="flex gap-6 relative mt-8">
        <div className="w-1/3">
          <PlayersList 
            players={players}
            currentPlayerAddress={user?.wallet?.address}
            onGameStart={handleGameStart}
            isInGame={false}
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