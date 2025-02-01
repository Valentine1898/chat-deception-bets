import { useParams, Link } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";
import ShareGameButtons from "@/components/ShareGameButtons";
import PlayersList from "@/components/PlayersList";
import { generateAlias, shuffleArray } from "@/utils/playerUtils";
import { useEffect, useState } from "react";

// Mock data for AI players
const AI_PLAYERS = [
  { id: 'ai1', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai2', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai3', type: 'ai' as const, alias: generateAlias() },
  { id: 'ai4', type: 'ai' as const, alias: generateAlias() },
];

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
    setTopicRevealCountdown(5); // Changed from 30 to 5 seconds
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
        <Link 
          to="/" 
          className="fixed top-24 left-4 z-50 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Link>
        
        <div className="flex gap-6 relative mt-8">
          <div className="w-1/3">
            <PlayersList 
              players={players}
              currentPlayerAddress={user?.wallet?.address}
              isInGame={true}
            />
          </div>
          
          <div className="w-2/3">
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {selectedTopic?.title}
                </CardTitle>
                {topicRevealCountdown !== null && topicRevealCountdown > 0 && (
                  <p className="text-muted-foreground mt-2">
                    Time to review the topic: {topicRevealCountdown}s
                  </p>
                )}
                {chatCountdown !== null && chatCountdown > 0 && (
                  <p className="text-muted-foreground mt-2">
                    Time remaining: {Math.floor(chatCountdown / 60)}:{(chatCountdown % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {selectedTopic && (
                  <div className="text-center mb-6">
                    <p className="text-lg text-muted-foreground">
                      {selectedTopic.description}
                    </p>
                  </div>
                )}
                {isChatVisible ? (
                  <div className="text-center text-muted-foreground">
                    Chat interface will be implemented here
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground animate-pulse">
                    Chat will be available after the topic review period
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-24 relative">
      <Link 
        to="/" 
        className="fixed top-24 left-4 z-50 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Games
      </Link>
      
      <div className="flex gap-6 relative mt-8">
        <div className="w-1/3">
          <PlayersList 
            players={players}
            currentPlayerAddress={user?.wallet?.address}
            onGameStart={handleGameStart}
            isInGame={false}
          />
        </div>

        {/* Game Lobby - Right Side */}
        <div className="w-2/3">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/a80f0ac3-8d80-48b2-9d4f-d311f160489f.png" 
              alt="Alan Turing" 
              className="logo w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-foreground mb-2">Turing Arena</h1>
          </div>

          {!authenticated ? (
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Connect Your Wallet to Join
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WalletConnect />
              </CardContent>
            </Card>
          ) : !hasPlacedBet ? (
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Place Your Bet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-lg mb-4">
                    Required bet amount: {mockGameData.betAmount} ETH
                  </p>
                  <Button 
                    onClick={placeBet}
                    className="bg-accent hover:bg-accent/90"
                  >
                    Place Bet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold text-foreground">
                  Game Lobby
                </CardTitle>
                <p className="text-xl text-muted-foreground animate-pulse">
                  {isCreator ? "Waiting for opponent to join..." : "Waiting for game to start..."}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted/50 p-4 text-center border border-muted">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Game ID</p>
                  <p className="text-lg font-mono text-accent">{gameId}</p>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={simulatePlayerJoin}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Simulate Player Join
                  </Button>
                </div>

                <ShareGameButtons gameUrl={gameUrl} />

                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isCreator 
                      ? "The game will start automatically when your opponent joins and places their bet"
                      : "The game will start automatically when both players have placed their bets"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLobbyPage;