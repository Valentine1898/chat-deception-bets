import { useState } from "react";
import { Reply } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

const ChatInterface = ({ currentUserAddress }) => {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSend = (event) => {
    event.preventDefault();
    const text = event.target.message.value;
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "You",
      senderAddress: currentUserAddress
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyingTo(null);
    event.target.reset();
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  return (
    <div className="h-[500px] w-full bg-background rounded-lg border border-muted overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-muted bg-muted/50">
        <h3 className="font-semibold text-foreground">Game Chat</h3>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOutgoing = message.senderAddress === currentUserAddress;
            return (
              <div
                key={message.id}
                className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-[80%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {message.sender}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleReply(message)}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      isOutgoing
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-muted mt-auto">
        {replyingTo && (
          <div className="px-4 py-2 bg-muted/50 border-b border-muted flex items-center">
            <span className="text-sm text-muted-foreground">
              Replying to {replyingTo.sender}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
          </div>
        )}
        <form onSubmit={handleSend} className="p-4 flex gap-2">
          <input
            name="message"
            className="flex-1 bg-muted/50 text-foreground rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message here..."
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;