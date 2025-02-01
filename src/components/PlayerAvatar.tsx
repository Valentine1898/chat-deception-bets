import { cn } from "@/lib/utils";

type PlayerAvatarProps = {
  type: 'human' | 'ai';
  className?: string;
};

const PlayerAvatar = ({ type, className }: PlayerAvatarProps) => {
  return (
    <div className={cn(
      "relative w-8 h-8 rounded-full",
      type === 'human' ? "bg-primary" : "bg-accent",
      className
    )}>
      <div className={cn(
        "absolute inset-1 rounded-full",
        type === 'human' 
          ? "bg-[#5A2100] border border-dashed border-[#FCAA7A]" 
          : "bg-[#0D5A00] border border-dashed border-[#92FC7A]"
      )}>
        {/* Decorative dots */}
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C6AB9B] top-1 left-1" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C6AB9B] top-1 right-1" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C6AB9B] bottom-1 left-1" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C6AB9B] bottom-1 right-1" />
        
        {/* Center circle with direction indicator */}
        <div className={cn(
          "absolute inset-0 m-auto w-4 h-4 rounded-full border",
          type === 'human' 
            ? "bg-[#C6AB9B] border-[#281104]" 
            : "bg-[#ACC69B] border-[#042804]"
        )}>
          <div className={cn(
            "absolute w-1 h-3 rounded-sm",
            type === 'human' 
              ? "bg-[#C6AB9B]" 
              : "bg-[#ACC69B]"
          )} 
          style={{
            left: '50%',
            top: '50%',
            transform: type === 'human' ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) rotate(45deg)',
          }}
          />
          <div className={cn(
            "absolute w-1 h-1.5 rounded-sm",
            type === 'human' ? "bg-[#281104]" : "bg-[#042804]"
          )}
          style={{
            left: '50%',
            top: type === 'human' ? '0' : '50%',
            transform: type === 'human' 
              ? 'translate(-50%, 0)' 
              : 'translate(-50%, -50%) rotate(45deg) translate(0, -4px)',
          }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerAvatar;