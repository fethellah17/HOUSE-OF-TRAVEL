import { VoyageStatus } from "@/types";
import { AlertTriangle, XCircle, Star } from "lucide-react";

interface VoyageStatusBadgeProps {
  status?: VoyageStatus;
  variant?: 'card' | 'detail';
}

const VoyageStatusBadge = ({ status, variant = 'card' }: VoyageStatusBadgeProps) => {
  if (!status || status === 'normal') return null;

  const getBadgeConfig = () => {
    switch (status) {
      case 'almost-full':
        return {
          text: 'باقي أماكن قليلة',
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          icon: AlertTriangle,
        };
      case 'full':
        return {
          text: 'الرحلة كاملة',
          bgColor: 'bg-red-600',
          textColor: 'text-white',
          icon: XCircle,
        };
      case 'limited-offer':
        return {
          text: 'عرض محدود',
          bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-500',
          textColor: 'text-gray-900',
          icon: Star,
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  const Icon = config.icon;

  if (variant === 'detail') {
    return (
      <div className={`inline-flex items-center gap-2 ${config.bgColor} ${config.textColor} px-4 py-2 rounded-lg text-sm font-bold shadow-lg`}>
        <Icon size={18} className="flex-shrink-0" />
        <span>{config.text}</span>
      </div>
    );
  }

  return (
    <div className={`absolute top-4 right-4 ${config.bgColor} ${config.textColor} px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm z-10 flex items-center gap-1.5`}>
      <Icon size={14} className="flex-shrink-0" />
      <span>{config.text}</span>
    </div>
  );
};

export default VoyageStatusBadge;
