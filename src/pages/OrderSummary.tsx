import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, Calendar, MapPin, CreditCard } from "lucide-react";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};

  // Calculate expected delivery (5-7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 6);
  const formattedDate = deliveryDate.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen p-4 space-y-6 animate-fade-in bg-background">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Package className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-title">Order Summary</h1>
          <p className="text-sm text-muted-foreground">
            Merci pour votre commande !
          </p>
        </div>

        <Card className="p-6 rounded-3xl space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-title text-sm">Order</h3>
              <p className="text-sm text-foreground">
                {orderData.orderNumber || '#123456789'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-title text-sm">Expected Delivery</h3>
              <p className="text-sm text-foreground capitalize">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-title text-sm">Shipping Address</h3>
              <p className="text-sm text-foreground">
                {orderData.name || 'John Doe'}<br />
                {orderData.address || '123 Main Street'}<br />
                {orderData.city || 'Paris'}, {orderData.zipCode || '75001'}<br />
                {orderData.state || 'Île-de-France'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-title text-sm">Payment Method</h3>
              <p className="text-sm text-foreground">
                {orderData.cardNumber 
                  ? `•••• •••• •••• ${orderData.cardNumber.slice(-4)}`
                  : 'Credit card'}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate("/dogs")}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            size="lg"
          >
            Track My Kit
          </Button>
          
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full rounded-full"
            size="lg"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
