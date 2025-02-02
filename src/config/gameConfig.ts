export const GAME_TIMINGS = {
  TOPIC_REVIEW: 5, // seconds
  CHAT_DISCUSSION: 20, // seconds for testing (normally would be 180)
  VOTING: 30, // seconds for voting stage
  AI_PLAYER_INTERVAL: 1000, // milliseconds between adding each AI player
} as const;

export type GameStage = 
  | "topic_discovery" 
  | "discussion" 
  | "human_detection" 
  | "waiting" 
  | "awaiting_votes" 
  | "results";