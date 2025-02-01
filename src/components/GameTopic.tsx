import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GameTopicProps = {
  topic: {
    title: string;
    description: string;
  } | null;
  topicRevealCountdown: number | null;
  chatCountdown: number | null;
  isChatVisible: boolean;
};

const GameTopic = ({ topic, topicRevealCountdown, chatCountdown, isChatVisible }: GameTopicProps) => {
  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          {topic?.title}
        </CardTitle>
        {topicRevealCountdown !== null && topicRevealCountdown > 0 && (
          <p className="text-muted-foreground mt-2">
            Time to review the topic: {topicRevealCountdown}s
          </p>
        )}
        {chatCountdown !== null && chatCountdown > 0 && (
          <p className="text-muted-foreground mt-2">
            Time remaining: {Math.floor(chatCountdown / 60)}:{(chatCountdown % 60).toString().padStart(2, '0')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {topic && (
          <div className="text-center mb-6">
            <p className="text-lg text-muted-foreground">
              {topic.description}
            </p>
          </div>
        )}
        {isChatVisible ? (
          <div className="text-center text-muted-foreground">
            Chat interface will be implemented here
          </div>
        ) : (
          <div className="text-center text-muted-foreground animate-pulse">
            Chat will be available after the topic review period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameTopic;
