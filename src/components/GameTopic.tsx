import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Topic = {
  title: string;
  description: string;
};

type GameTopicProps = {
  topic: Topic | null;
  isChatVisible: boolean;
};

const GameTopic = ({ topic, isChatVisible }: GameTopicProps) => {
  if (!topic) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
        <CardHeader>
          <CardTitle>{topic.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{topic.description}</p>
        </CardContent>
      </Card>

      {isChatVisible && (
        <Card className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
          <CardHeader>
            <CardTitle>Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chat component would go here */}
            <p className="text-muted-foreground">Chat messages will appear here...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameTopic;
