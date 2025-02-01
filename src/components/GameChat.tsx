import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
};

export default function GameChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      sender: "You",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[600px] flex-col rounded-lg border border-accent/10 bg-secondary/80 backdrop-blur-sm">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.sender === "You"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">
                  {message.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t border-accent/10 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[44px] w-full resize-none bg-secondary px-3 py-2 text-foreground"
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