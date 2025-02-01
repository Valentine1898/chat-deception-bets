import { cn } from "@/lib/utils";

type PlayerAvatarProps = {
  type: 'human' | 'ai';
  variant?: 'orange' | 'green' | 'yellow' | 'blue' | 'purple' | 'pink';
  className?: string;
};

const VARIANTS = {
  orange: {
    outer: "bg-[#BF4E0C]",
    inner: "bg-[#5A2100]",
    border: "border-[#FCAA7A]",
    dots: "bg-[#C6AB9B]",
    center: {
      bg: "bg-[#C6AB9B]",
      border: "border-[#281104]",
      arrow: "bg-[#281104]"
    }
  },
  green: {
    outer: "bg-[#36BF0C]",
    inner: "bg-[#0D5A00]",
    border: "border-[#92FC7A]",
    dots: "bg-[#ACC69B]",
    center: {
      bg: "bg-[#ACC69B]",
      border: "border-[#042804]",
      arrow: "bg-[#042804]"
    }
  },
  yellow: {
    outer: "bg-[#BF8F0C]",
    inner: "bg-[#5A4200]",
    border: "border-[#FCDA7A]",
    dots: "bg-[#C6BB9B]",
    center: {
      bg: "bg-[#C6BB9B]",
      border: "border-[#281E04]",
      arrow: "bg-[#281E04]"
    }
  },
  blue: {
    outer: "bg-[#0C9EBF]",
    inner: "bg-[#00495A]",
    border: "border-[#7AE4FC]",
    dots: "bg-[#9BBEC6]",
    center: {
      bg: "bg-[#9BBEC6]",
      border: "border-[#042128]",
      arrow: "bg-[#042128]"
    }
  },
  purple: {
    outer: "bg-[#5A0CBF]",
    inner: "bg-[#27005A]",
    border: "border-[#B37AFC]",
    dots: "bg-[#AE9BC6]",
    center: {
      bg: "bg-[#AE9BC6]",
      border: "border-[#130428]",
      arrow: "bg-[#130428]"
    }
  },
  pink: {
    outer: "bg-[#BF0C66]",
    inner: "bg-[#5A002D]",
    border: "border-[#FC7ABB]",
    dots: "bg-[#C69BB1]",
    center: {
      bg: "bg-[#C69BB1]",
      border: "border-[#280416]",
      arrow: "bg-[#280416]"
    }
  }
};

const PlayerAvatar = ({ type, variant = 'orange', className }: PlayerAvatarProps) => {
  const colors = VARIANTS[variant];
  const rotation = type === 'human' ? 0 : 45;
  const arrowRotation = type === 'human' ? 0 : 45;

  return (
    <div className={cn(
      "relative w-8 h-8 rounded-full bg-[#0C0A09]",
      className
    )}>
      <div className={cn(
        "absolute inset-1 rounded-full",
        colors.outer
      )}>
        <div className={cn(
          "absolute inset-0 rounded-full",
          colors.inner,
          "border border-dashed",
          colors.border
        )}>
          {/* Decorative dots */}
          <div className={cn("absolute w-1.5 h-1.5 rounded-full top-1 left-1", colors.dots)} />
          <div className={cn("absolute w-1.5 h-1.5 rounded-full top-1 right-1", colors.dots)} />
          <div className={cn("absolute w-1.5 h-1.5 rounded-full bottom-1 left-1", colors.dots)} />
          <div className={cn("absolute w-1.5 h-1.5 rounded-full bottom-1 right-1", colors.dots)} />
          
          {/* Center circle with direction indicator */}
          <div className={cn(
            "absolute inset-0 m-auto w-4 h-4 rounded-full border",
            colors.center.bg,
            colors.center.border
          )}>
            <div className={cn(
              "absolute w-1 h-3 rounded-sm",
              colors.center.bg
            )} 
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
            />
            <div className={cn(
              "absolute w-1 h-1.5 rounded-sm",
              colors.center.arrow
            )}
            style={{
              left: '50%',
              top: type === 'human' ? '0' : '50%',
              transform: type === 'human' 
                ? 'translate(-50%, 0)' 
                : `translate(-50%, -50%) rotate(${arrowRotation}deg) translate(0, -4px)`,
            }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerAvatar;