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
        "bg-card rounded-2xl p-3 cursor-pointer transition-all duration-200 border-0",
        "shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="icon-container">
          <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
        </div>
        <span className="text-sm font-medium text-foreground text-center">{label}</span>
      </div>
    </button>
  );
};
export default QuickActionCard;