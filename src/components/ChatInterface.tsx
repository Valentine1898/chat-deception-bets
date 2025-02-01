import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import styles from "@chatscope/chat-ui-kit-react/dist/default.min.css";

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

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: "You",
      senderAddress: currentUserAddress,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-[500px] w-full bg-background rounded-lg border border-muted overflow-hidden">
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
              />
            ))}
          </MessageList>
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
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatInterface;