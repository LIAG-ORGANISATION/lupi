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
        "flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-xs text-center font-medium">{label}</span>
    </button>
  );
};

export default QuickActionCard;
