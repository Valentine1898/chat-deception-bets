import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { wsService, ChatMessage } from "@/services/websocket";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import PlayerAvatar from "./PlayerAvatar";
import { getStoredMessages, storeMessages } from "@/utils/localStorage";

export default function GameChat() {
  const { gameId } = useParams<{ gameId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const processedMessageIds = useRef(new Set<string>());
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");

  useEffect(() => {
    if (gameId) {
      const storedMessages = getStoredMessages(gameId);
      setMessages(storedMessages);
      storedMessages.forEach(msg => processedMessageIds.current.add(msg.id || ''));

      console.log('🎮 Initializing chat for game:', gameId);

      const handleReconnect = () => {
        console.log('🔄 Reconnecting to chat...');
        toast({
          title: "Reconnecting to chat...",
          duration: 2000,
        });
      };

      const unsubscribe = wsService.onMessage((message) => {
        if (!message.id) {
          console.warn('⚠️ Received message without ID:', message);
          return;
        }

        if (processedMessageIds.current.has(message.id)) {
          console.log('🚫 Skipping duplicate message:', message.id);
          return;
        }

        console.log('📩 Received chat message:', message);
        processedMessageIds.current.add(message.id);
        
        const newMessage: ChatMessage = {
          ...message,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        };
        
        setMessages(prev => {
          const updatedMessages = [...prev, newMessage];
          storeMessages(gameId, updatedMessages);
          return updatedMessages;
        });
      });

      const handleSessionInfo = (sessionInfo: any) => {
        console.log('Received session info:', sessionInfo);
        setCurrentPlayerId(sessionInfo.you);
      };

      wsService.onSessionInfo(handleSessionInfo);

      wsService.onDisconnect(() => {
        console.log('📴 Chat disconnected');
        toast({
          title: "Chat disconnected",
          description: "Attempting to reconnect...",
          variant: "destructive",
        });
      });

      wsService.onReconnect(handleReconnect);

      return () => {
        console.log('🔄 Cleaning up chat connection');
        unsubscribe();
      };
    }
  }, [gameId, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log('✉️ User sending message:', input.trim());
    wsService.sendMessage(input.trim());
    setInput("");
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[360px] flex-col justify-between box-border p-2 gap-10 w-[552px] bg-[#1C1917] border border-muted rounded-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.playerId === currentPlayerId;
            const avatarVariant = isCurrentUser ? 1 : 
              ((message.sender?.id || index) % 5 + 2) as 1 | 2 | 3 | 4 | 5 | 6;

            return (
              <div
                key={message.id || index}
                className={cn(
                  "flex items-start gap-2",
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <PlayerAvatar 
                  type="human"
                  variant={avatarVariant}
                  className="flex-shrink-0 w-8 h-8"
                />
                <div className={cn(
                  "flex flex-col gap-1 max-w-[80%]",
                  isCurrentUser ? "items-end" : "items-start"
                )}>
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      isCurrentUser ? "bg-accent text-background" : "bg-muted text-foreground"
                    )}>
                      {isCurrentUser ? "You" : message.sender?.name || message.playerId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground"
                    )}
                  >
                    <p className="break-words">{message.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[44px] w-full resize-none bg-card px-3 py-2 text-card-foreground placeholder:text-muted"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            className="h-[44px] w-[44px] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}