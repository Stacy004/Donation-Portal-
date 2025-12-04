import HeroSection from "@/components/HeroSection";
import DonationPortal from "@/components/DonationPortal";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-xl mx-auto">
          <HeroSection />
          
          <div className="space-y-6">
            <DonationPortal />
            <ContactSection />
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Mentors Foundation. All donations go directly to supporting children in need.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Index;
