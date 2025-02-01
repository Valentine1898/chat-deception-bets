import { cn } from "@/lib/utils";

type PlayerAvatarProps = {
  type: 'human' | 'ai';
  variant?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

const PlayerAvatar = ({ type, variant = 1, className }: PlayerAvatarProps) => {
  return (
    <img 
      src={`/avatars/${variant}.svg`}
      alt={`Player avatar ${variant}`}
      className={cn("w-8 h-8 rounded-full", className)}
    />
  );
};

export default PlayerAvatar;