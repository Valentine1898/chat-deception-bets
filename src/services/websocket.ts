import { toast } from "sonner";

export type ChatMessage = {
  playerId: string;
  message: string;
  id?: string;
};

export type SessionInfo = {
  players: string[];
  you: string;
  session_id: string;
};

type MessageType = 'chat' | 'session_info' | 'error';

type WebSocketMessage = {
  type: MessageType;
  content: any;
  sender?: string;
};

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private sessionInfoHandlers: ((info: SessionInfo) => void)[] = [];
  private disconnectHandlers: (() => void)[] = [];
  private reconnectHandlers: (() => void)[] = [];
  private processedMessageIds = new Set<string>();

  connect(sessionId: string) {
    console.log('🌐 Connecting to WebSocket with sessionId:', sessionId);
    this.ws = new WebSocket(`ws://localhost:8080?sessionId=${sessionId}`);

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log('📥 Received WebSocket message:', data);
        
        switch (data.type) {
          case 'chat':
            const messageId = data.content.id || `${data.sender}-${Date.now()}`;
            
            if (this.processedMessageIds.has(messageId)) {
              console.log('🔄 Skipping duplicate message:', messageId);
              return;
            }
            
            const chatMessage: ChatMessage = {
              playerId: data.sender || 'unknown',
              message: data.content.message,
              id: messageId
            };
            
            console.log('💬 Processing new chat message:', chatMessage);
            this.processedMessageIds.add(messageId);
            this.messageHandlers.forEach(handler => handler(chatMessage));
            break;

          case 'session_info':
            const sessionInfo: SessionInfo = data.content;
            console.log('ℹ️ Processing session info:', sessionInfo);
            this.sessionInfoHandlers.forEach(handler => handler(sessionInfo));
            break;

          case 'error':
            console.error('❌ WebSocket error message:', data.content.message);
            toast.error(data.content.message);
            break;
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error, 'Raw data:', event.data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      toast.error("WebSocket connection error");
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket connection closed');
      this.disconnectHandlers.forEach(handler => handler());
      // Attempt to reconnect after a delay
      setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        this.reconnectHandlers.forEach(handler => handler());
        this.connect(sessionId);
      }, 3000);
    };

    this.ws.onopen = () => {
      console.log('✅ WebSocket connection established');
    };
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('📤 Sending WebSocket message:', message);
      this.ws.send(message);
    } else {
      console.error('❌ Cannot send message - WebSocket not ready. State:', this.ws?.readyState);
      toast.error("WebSocket connection not ready");
    }
  }

  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onSessionInfo(handler: (info: SessionInfo) => void) {
    this.sessionInfoHandlers.push(handler);
    return () => {
      this.sessionInfoHandlers = this.sessionInfoHandlers.filter(h => h !== handler);
    };
  }

  onDisconnect(handler: () => void) {
    this.disconnectHandlers.push(handler);
    return () => {
      this.disconnectHandlers = this.disconnectHandlers.filter(h => h !== handler);
    };
  }

  onReconnect(handler: () => void) {
    this.reconnectHandlers.push(handler);
    return () => {
      this.reconnectHandlers = this.reconnectHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    if (this.ws) {
      console.log('🔌 Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
      this.processedMessageIds.clear();
    }
  }
}

export const wsService = new WebSocketService();