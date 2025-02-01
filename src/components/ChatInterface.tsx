import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-react/dist/default.min.css";

type Message = {
  id: string;
  text: string;
  sender: string;
  senderAddress?: string;
};

type ChatInterfaceProps = {
  currentUserAddress: string;
};

const ChatInterface = ({ currentUserAddress }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "You",
      senderAddress: currentUserAddress,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="h-[500px] rounded-lg border border-muted">
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((message) => (
              <Message
                key={message.id}
                model={{
                  message: message.text,
                  sender: message.sender,
                  direction: message.senderAddress === currentUserAddress ? "outgoing" : "incoming",
                  position: "single",
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={handleSend}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatInterface;