import { Card } from "@/components/ui/card";
import GameChat from "./GameChat";

type GameTopicProps = {
  topic: {
    title: string;
    description: string;
  } | null;
  isChatVisible: boolean;
};

const GameTopic = ({ topic, isChatVisible }: GameTopicProps) => {
  if (!topic) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 bg-secondary/80 backdrop-blur-sm border-accent/10">
        <h2 className="text-xl font-semibold mb-3 text-foreground">
          {topic.title}
        </h2>
        <p className="text-muted-foreground">
          {topic.description}
        </p>
      </Card>

      {isChatVisible && (
        <div className="animate-slide-up">
          <GameChat />
        </div>
      )}
    </div>
  );
};

export default GameTopic;