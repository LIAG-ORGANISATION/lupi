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
        "n26-card cursor-pointer border-0",
        "transition-all",
        className
      )}
      style={{
        padding: '16px',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="icon-container">
          <Icon strokeWidth={1.5} />
        </div>
        <span className="text-foreground text-center" style={{ fontSize: '12px', fontWeight: 300 }}>{label}</span>
      </div>
    </button>
  );
};
export default QuickActionCard;