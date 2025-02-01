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

const defaultMessages: Message[] = [
  {
    id: "1",
    content: "I think AI has both positive and negative impacts on society.",
    sender: "Player 1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: "2",
    content: "True, but the benefits of AI in healthcare and education are undeniable.",
    sender: "Player 2",
    timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
  },
  {
    id: "3",
    content: "We need to focus on responsible AI development and ethical guidelines.",
    sender: "Player 3",
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
  },
  {
    id: "4",
    content: "What about AI's impact on job markets? That's a major concern.",
    sender: "Player 4",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
  }
];

export default function GameChat() {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
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