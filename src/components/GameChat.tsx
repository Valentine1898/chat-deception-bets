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
    <div className="flex h-[360px] flex-col justify-between box-border p-2 gap-10 w-[552px] bg-background/50 border border-muted rounded-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.playerId === "You"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {message.playerId}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t border-muted/50 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[44px] w-full resize-none bg-background/50 px-3 py-2 text-foreground"
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