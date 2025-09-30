import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EthicalCharter = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState({
    read: false,
    abide: false,
  });

  const canJoin = agreed.read && agreed.abide;

  const charter = [
    {
      title: "1. Respect and Professionalism",
      content: "Treat all members with respect and professionalism. Avoid offensive language, harassment, or discrimination of any kind.",
    },
    {
      title: "2. Confidentiality",
      content: "Respect the confidentiality of information shared within the network. Do not disclose sensitive or proprietary information without explicit consent.",
    },
    {
      title: "3. Collaboration and Support",
      content: "Foster a collaborative and supportive environment. Offer assistance and guidance to fellow members, and engage in constructive discussions.",
    },
    {
      title: "4. Integrity and Honesty",
      content: "Maintain integrity and honesty in all interactions. Provide accurate information and avoid misrepresentation of your skills or experience.",
    },
    {
      title: "5. Inclusivity and Diversity",
      content: "Embrace diversity and inclusivity. Value different perspectives and experiences, and create a welcoming space for all members.",
    },
    {
      title: "6. Constructive Feedback",
      content: "Provide constructive feedback when necessary. Focus on improving collaboration and outcomes, and avoid personal attacks or negativity.",
    },
    {
      title: "7. Conflict Resolution",
      content: "Address conflicts respectfully and professionally. Seek mediation or assistance from network administrators if necessary.",
    },
    {
      title: "8. Intellectual Property",
      content: "Respect intellectual property rights. Obtain proper authorization before using or sharing copyrighted materials.",
    },
    {
      title: "9. Data Privacy",
      content: "Protect the privacy of personal data. Adhere to data protection regulations and handle personal data responsibly.",
    },
    {
      title: "10. Network Reputation",
      content: "Uphold the reputation of the network. Avoid actions that could harm the network's image or credibility.",
    },
    {
      title: "11. Compliance with Laws",
      content: "Comply with all applicable laws and regulations. Do not engage in illegal activities or promote unlawful behavior.",
    },
    {
      title: "12. Reporting Violations",
      content: "Report any violations of this charter to network administrators. Provide accurate and complete information when reporting issues.",
    },
    {
      title: "13. Amendments",
      content: "This charter may be amended from time to time. Members will be notified of any changes, and continued participation in the network implies acceptance of the updated charter.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center gap-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professional/welcome")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-title">Ethical Charter</h1>
        </div>

        <div className="p-6 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-title">
              Lupi's Ethical Charter of<br />Collaboration
            </h2>
            <p className="text-foreground max-w-2xl mx-auto">
              Welcome to Lupi! Before you join our network of professionals, please review and agree to our Ethical Charter of Collaboration. This charter outlines the principles and values that guide our community, ensuring a safe, inclusive, and productive environment for all members.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            {charter.map((item, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-bold text-title">{item.title}</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto space-y-4 pt-8 border-t border-border">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="read"
                  checked={agreed.read}
                  onCheckedChange={(checked) =>
                    setAgreed({ ...agreed, read: checked as boolean })
                  }
                />
                <label
                  htmlFor="read"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and understood the Lupi's Ethical Charter of Collaboration.
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="abide"
                  checked={agreed.abide}
                  onCheckedChange={(checked) =>
                    setAgreed({ ...agreed, abide: checked as boolean })
                  }
                />
                <label
                  htmlFor="abide"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to abide by the principles and values outlined in this charter.
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                onClick={() => navigate("/professional/ethical-charter")}
                variant="outline"
                className="rounded-full"
                size="lg"
              >
                Read the Ethical Charter
              </Button>
              
              <Button
                onClick={() => navigate("/professional/edit-profile")}
                disabled={!canJoin}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                size="lg"
              >
                Join the Network
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicalCharter;
