import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { wsService, ChatMessage } from "@/services/websocket";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function GameChat() {
  const { gameId } = useParams<{ gameId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const processedMessageIds = useRef(new Set<string>());

  useEffect(() => {
    if (gameId) {
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
        setMessages(prev => [...prev, message]);
      });

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
        wsService.disconnect();
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
            const isCurrentUser = message.playerId === "You";
            const timestamp = new Date().toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            return (
              <div
                key={message.id || index}
                className={cn(
                  "flex gap-2",
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex max-w-[80%] flex-col gap-1 rounded-lg px-4 py-2 text-sm",
                    isCurrentUser
                      ? "bg-[#FD9A00] text-[#1C1917]"
                      : "bg-[#292524] text-white"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2 text-xs",
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  )}>
                    <span className="font-medium">
                      {isCurrentUser ? "You" : message.playerId}
                    </span>
                    <span className="opacity-50">
                      {timestamp}
                    </span>
                  </div>
                  <p className="break-words">{message.message}</p>
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
            className="min-h-[44px] w-full resize-none bg-[#292524] px-3 py-2 text-white placeholder:text-white/50"
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
            className="h-[44px] w-[44px] bg-[#FD9A00] text-[#1C1917] hover:bg-[#FD9A00]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}