import { toast } from "sonner";

export type Player = {
  name: string;
  id: number;
};

export type ChatMessage = {
  playerId: string;
  message: string;
  id?: string;
  timestamp?: string;
  sender?: {
    name: string;
    id: number;
  };
};

export type SessionInfo = {
  players: Player[];
  you: number;
  session_id: string;
};

type MessageType = 'chat' | 'session_info' | 'error' | 'session_pending' | 'session_started' | 'session_finished' | 'topic';

type WebSocketMessage = {
  type: MessageType;
  content: any;
  sender?: {
    name: string;
    id: number;
  };
};


export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private sessionInfoHandlers: ((info: SessionInfo) => void)[] = [];
  private topicMessageHandlers: ((topic: string) => void)[] = [];
  private sessionStartHandlers: (() => void)[] = [];
  private disconnectHandlers: (() => void)[] = [];
  private reconnectHandlers: (() => void)[] = [];
  private processedMessageIds = new Set<string>();
  private isConnected = false;

  connect(sessionId: string) {
    if (this.isConnected) {
      console.log('🔄 Already connected to WebSocket');
      return;
    }

    console.log('🌐 Connecting to WebSocket with sessionId:', sessionId);
    this.ws = new WebSocket(`wss://test-latest-vz6j.onrender.com?sessionId=${sessionId}`);
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        console.log('📥 Received WebSocket message:', data);
        
        switch (data.type) {
          case 'chat':
            if (typeof data.content === 'object' && data.content.message) {
              const messageId = `${data.sender}-${Date.now()}`;
              
              if (this.processedMessageIds.has(messageId)) {
                console.log('🔄 Skipping duplicate message:', messageId);
                return;
              }
              
              const chatMessage: ChatMessage = {
                playerId: data.sender.name || 'Unknown',
                message: data.content.message,
                id: messageId,
                timestamp: new Date().toLocaleTimeString()
              };
              
              this.messageHandlers.forEach(handler => handler(chatMessage));
              this.processedMessageIds.add(messageId);
            }
            break;

          case 'topic':
            console.log('📝 Received topic:', data.content);
            this.topicMessageHandlers.forEach(handler => handler(data.content));
            break;

          case 'session_info':
            console.log('ℹ️ Received session info:', data.content);
            this.sessionInfoHandlers.forEach(handler => handler(data.content));
            break;

          case 'session_started':
            console.log('🎮 Session started');
            this.sessionStartHandlers.forEach(handler => handler());
            break;

          case 'error':
            console.error('❌ WebSocket error message:', data.content);
            toast.error(data.content);
            break;

          case 'session_pending':
            toast.info("Waiting for other players to join...");
            break;
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error, 'Raw data:', event.data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      toast.error("Connection error occurred");
      this.isConnected = false;
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket connection closed');
      this.isConnected = false;
      this.disconnectHandlers.forEach(handler => handler());
      toast.error("Connection lost. Please refresh the page to reconnect.");
    };

    this.ws.onopen = () => {
      console.log('✅ WebSocket connection established');
      this.isConnected = true;
    };
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('📤 Sending chat message:', message);
      const payload = JSON.stringify({
        type: 'chat',
        content: message
      });
      this.ws.send(payload);
    } else {
      console.error('❌ Cannot send message - WebSocket not ready');
      toast.error("Connection lost. Please refresh the page to reconnect.");
    }
  }

  requestTopic() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('📤 Requesting topic');
      const payload = JSON.stringify({
        type: 'get_topic'
      });
      this.ws.send(payload);
    }
  }

  startSession() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('📤 Starting session');
      const payload = JSON.stringify({
        type: 'start_session'
      });
      this.ws.send(payload);
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

  onTopicMessage(handler: (topic: string) => void) {
    this.topicMessageHandlers.push(handler);
    return () => {
      this.topicMessageHandlers = this.topicMessageHandlers.filter(h => h !== handler);
    };
  }

  onSessionStart(handler: () => void) {
    this.sessionStartHandlers.push(handler);
    return () => {
      this.sessionStartHandlers = this.sessionStartHandlers.filter(h => h !== handler);
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
      this.isConnected = false;
      this.processedMessageIds.clear();
    }
  }
}

export const wsService = new WebSocketService();
