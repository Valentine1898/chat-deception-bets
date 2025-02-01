import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-react/dist/default.min.css";
import { Reply } from "lucide-react";
import { Button } from "./ui/button";

type MessageType = {
  id: string;
  text: string;
  sender: string;
  senderAddress?: string;
};

type ChatInterfaceProps = {
  currentUserAddress: string;
};

const ChatInterface = ({ currentUserAddress }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: "You",
      senderAddress: currentUserAddress,
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyingTo(null);
  };

  const handleReply = (message: MessageType) => {
    setReplyingTo(message);
  };

  return (
    <div className="h-[500px] w-full bg-background rounded-lg border border-muted overflow-hidden flex flex-col">
      <ConversationHeader>
        <ConversationHeader.Content>
          <span className="text-foreground">Game Chat</span>
        </ConversationHeader.Content>
      </ConversationHeader>
      
      <div className="flex-1 overflow-y-auto">
        <MainContainer>
          <ChatContainer>
            <MessageList className="p-4">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  model={{
                    message: message.text,
                    sender: message.sender,
                    direction: message.senderAddress === currentUserAddress ? "outgoing" : "incoming",
                    position: "single",
                  }}
                  className="mb-4"
                >
                  <Message.Header>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar name={message.sender} size="sm" />
                      <span className="font-medium text-sm text-foreground/80">
                        {message.sender}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => handleReply(message)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    </div>
                  </Message.Header>
                  {message.text}
                </Message>
              ))}
            </MessageList>
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
              <MessageInput
                placeholder="Type your message here..."
                onSend={handleSend}
                attachButton={false}
                className="border-t border-muted bg-background"
                style={{
                  background: "var(--background)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default ChatInterface;