import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}
const QuickActionCard = ({
  icon: Icon,
  label,
  onClick,
  className
}: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl cursor-pointer border-0",
        "transition-all",
        className
      )}
      style={{
        padding: '16px',
        transitionDuration: '250ms',
        transitionTimingFunction: 'ease-in-out',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.04)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center">
          <Icon className="h-8 w-8" strokeWidth={1.5} style={{ color: 'hsl(20 28% 28%)' }} />
        </div>
        <span className="font-medium text-foreground text-center" style={{ fontSize: '12px' }}>{label}</span>
      </div>
    </button>
  );
};
export default QuickActionCard;