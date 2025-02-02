import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const WaitingComponent = () => {
  return (
    <Card className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-muted">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Waiting for game results...
          </h2>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitingComponent;