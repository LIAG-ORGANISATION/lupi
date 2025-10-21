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
        "bg-card rounded-xl p-4 cursor-pointer transition-all duration-300 border-0",
        "shadow-sm hover:shadow-md hover:-translate-y-1 active:scale-95",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="icon-container">
          <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: 'hsl(0 0% 45%)' }} />
        </div>
        <span className="font-medium text-foreground text-center" style={{ fontSize: '14px' }}>{label}</span>
      </div>
    </button>
  );
};
export default QuickActionCard;