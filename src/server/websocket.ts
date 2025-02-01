import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

type GameState = {
  [gameId: string]: {
    players: {
      address: string;
      hasJoined: boolean;
    }[];
  };
};

const games: GameState = {};

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'JOIN_GAME':
          handleJoinGame(ws, data);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function handleJoinGame(ws: WebSocket, data: { gameId: string; playerAddress: string }) {
  const { gameId, playerAddress } = data;

  // Initialize game if it doesn't exist
  if (!games[gameId]) {
    games[gameId] = {
      players: []
    };
  }

  // Add player if not already in game
  const game = games[gameId];
  const existingPlayer = game.players.find(p => p.address === playerAddress);
  
  if (!existingPlayer) {
    game.players.push({
      address: playerAddress,
      hasJoined: true
    });

    // Broadcast to all clients in this game
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'GAME_UPDATE',
          gameId,
          players: game.players
        }));
      }
    });
  }
}

console.log('WebSocket server running on port 8080');