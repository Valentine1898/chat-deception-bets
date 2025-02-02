export const getStoredMessages = (gameId: string) => {
  const stored = localStorage.getItem(`game_${gameId}_messages`);
  return stored ? JSON.parse(stored) : [];
};

export const storeMessages = (gameId: string, messages: any[]) => {
  localStorage.setItem(`game_${gameId}_messages`, JSON.stringify(messages));
};

export const getStoredPlayers = (gameId: string) => {
  const stored = localStorage.getItem(`game_${gameId}_players`);
  return stored ? JSON.parse(stored) : [];
};

export const storePlayers = (gameId: string, players: any[]) => {
  localStorage.setItem(`game_${gameId}_players`, JSON.stringify(players));
};