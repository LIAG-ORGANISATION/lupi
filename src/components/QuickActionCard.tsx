import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

const QuickActionCard = ({ icon: Icon, label, onClick, className }: QuickActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4 lupi-card min-h-[100px]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-gradient-card flex items-center justify-center">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <span className="text-xs text-center font-semibold text-title">{label}</span>
    </button>
  );
};

export default QuickActionCard;
