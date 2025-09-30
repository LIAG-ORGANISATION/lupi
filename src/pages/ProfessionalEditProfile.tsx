import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { X, Camera, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const ProfessionalEditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "Olivia Bennett",
    profession: "Pet Care Specialist",
    location: "San Francisco, CA",
    bio: "",
    specializations: ["Pet Sitting", "Dog Walking"],
    certifications: [],
    languages: ["English"],
    services: [],
    hourlyRate: "",
    emailContact: true,
    phoneContact: false,
    messagingContact: true,
    profileVisible: false,
  });

  const [newSpec, setNewSpec] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newService, setNewService] = useState({ name: "", duration: "" });

  const handleSave = () => {
    toast({
      title: "Profil enregistré",
      description: "Vos informations ont été mises à jour.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/professionals")}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-title">Edit profile</h1>
          <Button
            onClick={handleSave}
            className="rounded-full bg-primary hover:bg-primary/90"
            size="sm"
          >
            Save
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-secondary text-title text-2xl font-bold">
                  OB
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-title">{formData.name}</h2>
              <p className="text-sm text-muted-foreground">{formData.profession}</p>
              <p className="text-sm text-muted-foreground">{formData.location}</p>
            </div>
          </div>

          {/* About Section */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">About</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-2xl bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="rounded-2xl bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="rounded-2xl bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="rounded-2xl bg-secondary/50 min-h-[100px]"
                placeholder="Tell us about yourself and your experience..."
              />
            </div>
          </Card>

          {/* Specializations */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary rounded-full text-sm"
                >
                  {spec}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Add specialization"
                className="rounded-2xl bg-secondary/50"
              />
              <Button
                onClick={() => {
                  if (newSpec) {
                    setFormData({
                      ...formData,
                      specializations: [...formData.specializations, newSpec],
                    });
                    setNewSpec("");
                  }
                }}
                size="icon"
                className="rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Certifications */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Certifications</h3>
            <Button variant="outline" className="w-full rounded-full justify-between">
              <span>Add certification</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>

          {/* Languages */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Languages</h3>
            <div className="space-y-2">
              {formData.languages.map((lang, index) => (
                <div key={index} className="text-sm">{lang}</div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-full justify-between">
              <span>Add language</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>

          {/* Services */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Services</h3>
            <Button variant="outline" className="w-full rounded-full justify-between">
              <span>Add service</span>
              <Plus className="h-4 w-4" />
            </Button>
          </Card>

          {/* Pricing */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Pricing</h3>
            <div className="space-y-2">
              <Label htmlFor="rate">Hourly rate</Label>
              <Input
                id="rate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="150"
                className="rounded-2xl bg-secondary/50"
              />
            </div>
          </Card>

          {/* Contact Preferences */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Contact preferences</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              <Switch
                id="email"
                checked={formData.emailContact}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailContact: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="phone">Phone</Label>
              <Switch
                id="phone"
                checked={formData.phoneContact}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, phoneContact: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="messaging">Messaging</Label>
              <Switch
                id="messaging"
                checked={formData.messagingContact}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, messagingContact: checked })
                }
              />
            </div>
          </Card>

          {/* Visibility */}
          <Card className="p-4 rounded-3xl space-y-4">
            <h3 className="font-bold text-title">Visibility</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Profile visibility</Label>
                <Switch
                  id="visible"
                  checked={formData.profileVisible}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, profileVisible: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                By making your profile visible, you agree to our{" "}
                <button className="text-primary underline">ethical charter</button>.
              </p>
            </div>
          </Card>

          <div className="flex gap-4 pb-8">
            <Button
              onClick={() => navigate(`/professionals/${1}`)}
              variant="outline"
              className="flex-1 rounded-full"
              size="lg"
            >
              Preview
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 rounded-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalEditProfile;
