import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Bug, Thermometer, Flower, Info } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface SeasonalAlert {
  id: string;
  title: string;
  content: string;
  alert_type: string;
  icon: string;
  severity: 'info' | 'warning' | 'danger';
  start_month: number | null;
  end_month: number | null;
}

const SeasonalAlertsDisplay = () => {
  const [alerts, setAlerts] = useState<SeasonalAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeasonalAlerts();
  }, []);

  const fetchSeasonalAlerts = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1; // 1-12

      const { data, error } = await supabase
        .from('seasonal_alerts')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      // Filtrer les alertes pertinentes pour le mois en cours
      const relevantAlerts = (data || [])
        .filter((alert) => {
          if (!alert.start_month || !alert.end_month) return true;

          // Gérer les périodes qui chevauchent l'année (ex: novembre à mars)
          if (alert.start_month <= alert.end_month) {
            return currentMonth >= alert.start_month && currentMonth <= alert.end_month;
          } else {
            return currentMonth >= alert.start_month || currentMonth <= alert.end_month;
          }
        })
        .map((alert) => ({
          ...alert,
          severity: alert.severity as 'info' | 'warning' | 'danger',
        }));

      setAlerts(relevantAlerts);
    } catch (error) {
      console.error('Error fetching seasonal alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'alert-triangle': AlertTriangle,
      'bug': Bug,
      'thermometer': Thermometer,
      'flower': Flower,
      'info': Info,
    };
    return iconMap[iconName] || AlertTriangle;
  };

  const getSeverityStyles = (severity: string) => {
    const styles = {
      info: {
        border: 'border-blue-500/50',
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        iconColor: 'text-blue-600 dark:text-blue-500',
        titleColor: 'text-blue-900 dark:text-blue-100',
        textColor: 'text-blue-800 dark:text-blue-200',
      },
      warning: {
        border: 'border-amber-500/50',
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        iconColor: 'text-amber-600 dark:text-amber-500',
        titleColor: 'text-amber-900 dark:text-amber-100',
        textColor: 'text-amber-800 dark:text-amber-200',
      },
      danger: {
        border: 'border-red-500/50',
        bg: 'bg-red-50 dark:bg-red-950/20',
        iconColor: 'text-red-600 dark:text-red-500',
        titleColor: 'text-red-900 dark:text-red-100',
        textColor: 'text-red-800 dark:text-red-200',
      },
    };
    return styles[severity as keyof typeof styles] || styles.warning;
  };

  if (loading || alerts.length === 0) return null;

  // Si une seule alerte, on l'affiche directement
  if (alerts.length === 1) {
    const alert = alerts[0];
    const Icon = getIcon(alert.icon);
    const styles = getSeverityStyles(alert.severity);

    return (
      <Alert className={`${styles.border} ${styles.bg}`}>
        <Icon className={`h-5 w-5 ${styles.iconColor}`} />
        <AlertTitle className={`${styles.titleColor} font-semibold`}>
          {alert.title}
        </AlertTitle>
        <AlertDescription className={`${styles.textColor} text-sm mt-2 whitespace-pre-line`}>
          {alert.content}
        </AlertDescription>
      </Alert>
    );
  }

  // Si plusieurs alertes, on utilise un carrousel
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {alerts.map((alert) => {
          const Icon = getIcon(alert.icon);
          const styles = getSeverityStyles(alert.severity);

          return (
            <CarouselItem key={alert.id}>
              <Alert className={`${styles.border} ${styles.bg}`}>
                <Icon className={`h-5 w-5 ${styles.iconColor}`} />
                <AlertTitle className={`${styles.titleColor} font-semibold`}>
                  {alert.title}
                </AlertTitle>
                <AlertDescription className={`${styles.textColor} text-sm mt-2 whitespace-pre-line`}>
                  {alert.content}
                </AlertDescription>
              </Alert>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
};

export default SeasonalAlertsDisplay;
