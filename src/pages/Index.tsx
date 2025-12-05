import HeroSection from "@/components/HeroSection";
import DonationPortal from "@/components/DonationPortal";
import ContactSection from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-xl mx-auto">
          {/* Admin Button */}
          <div className="flex justify-end mb-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/admin-login")}
            >
              <Lock className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>

          <HeroSection />
          
          <div className="space-y-6">
            <DonationPortal />
            <ContactSection />
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Mentors Foundation. All donations go directly to supporting children in need in Ghana
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Index;
