import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TestTube2, Heart, Eye, Dna } from "lucide-react";
import heroImage from "@/assets/hero-dog-dna.jpg";

const DNAKit = () => {
  const navigate = useNavigate();

  const included = [
    { icon: TestTube2, text: "1 Swab (Sterile & Hygienic)" },
    { icon: Heart, text: "Health Risk Assessment" },
    { icon: Eye, text: "Ancestry & Trait Analysis" },
  ];

  const benefits = [
    { icon: Dna, text: "Personalized breed identification" },
    { icon: Heart, text: "Early detection of breed illnesses" },
    { icon: Eye, text: "Enhanced understanding of Your Dog" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-secondary flex flex-col items-center justify-center text-center px-4">
        <img 
          src={heroImage} 
          alt="DNA Kit Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl font-bold text-title">
            Unlock the secrets of<br />your dog's DNA
          </h1>
          <Button
            onClick={() => {
              // Scroll to product details
              document.getElementById('product-details')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
            size="lg"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div id="product-details" className="p-4 space-y-6 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="space-y-4">
          <div className="bg-[#5C9B9B] rounded-3xl p-8 flex items-center justify-center">
            <div className="bg-white/90 rounded-2xl p-6 w-full max-w-[200px]">
              <TestTube2 className="h-24 w-24 text-[#5C9B9B] mx-auto" />
              <div className="text-center mt-4">
                <p className="text-xs font-medium text-gray-600">DNA KIT</p>
                <p className="text-xs text-gray-600">by Lupi</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-title">Dog DNA Test Kit</h2>
            <p className="text-sm text-foreground leading-relaxed">
              Get to know your dog on a deeper level! Our DNA test analyzes over 350 breeds, types, and varieties, identifies genetic health risks, and uncovers unique personality traits to help you provide the best care possible.
            </p>
          </div>

          <Card className="p-6 rounded-3xl space-y-4 bg-secondary/50">
            <h3 className="text-lg font-bold text-title">What's Included</h3>
            <div className="space-y-3">
              {included.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-title">Key Benefits</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{benefit.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-3 pt-4 pb-20">
            <Button
              onClick={() => navigate("/checkout")}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              size="lg"
            >
              Add to Cart - $99
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAKit;
