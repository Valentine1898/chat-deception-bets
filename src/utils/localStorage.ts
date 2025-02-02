import { contractService } from "@/services/contractService";

const CONTRACT_ADDRESS = "0x803d92FA9c82d533E808E6038A84EBca5E36fC1C";

const getStorageKey = (gameId: string, type: 'messages' | 'players') => {
  return `${CONTRACT_ADDRESS}_game_${gameId}_${type}`;
};

export const getStoredMessages = (gameId: string) => {
  const stored = localStorage.getItem(getStorageKey(gameId, 'messages'));
  return stored ? JSON.parse(stored) : [];
};

export const storeMessages = (gameId: string, messages: any[]) => {
  localStorage.setItem(getStorageKey(gameId, 'messages'), JSON.stringify(messages));
};

export const getStoredPlayers = (gameId: string) => {
  const stored = localStorage.getItem(getStorageKey(gameId, 'players'));
  return stored ? JSON.parse(stored) : [];
};

export const storePlayers = (gameId: string, players: any[]) => {
  localStorage.setItem(getStorageKey(gameId, 'players'), JSON.stringify(players));
};

// Helper function to clear all data for previous contract versions
export const clearPreviousContractData = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !key.startsWith(CONTRACT_ADDRESS)) {
      localStorage.removeItem(key);
    }
  }
};

// Clear old data when this module loads
clearPreviousContractData();