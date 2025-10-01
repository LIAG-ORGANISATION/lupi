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
        "lupi-card cursor-pointer hover:shadow-lg transition-all",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="w-12 h-12 rounded-full bg-gradient-card flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-semibold text-title text-center">{label}</span>
      </div>
    </button>
  );
};
export default QuickActionCard;