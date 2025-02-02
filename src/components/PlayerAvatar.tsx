import { cn } from "@/lib/utils";

type PlayerAvatarProps = {
  type: string;
  variant?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

const PlayerAvatar = ({ type, variant = 1, className }: PlayerAvatarProps) => {
  return (
    <div className={cn(
      "relative flex items-center justify-center w-10 h-10",
      className
    )}>
      <img 
        src={`/avatars/${variant}.svg`}
        alt={`Player avatar ${variant}`}
        className="w-full h-full"
        style={{
          filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))"
        }}
      />
    </div>
  );
};

export default PlayerAvatar;