import { Phone, Heart } from "lucide-react";

const ContactSection = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 animate-fade-up-delay-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Phone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Need Help?</h3>
          <p className="text-sm text-muted-foreground">Contact us directly</p>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-1">Reach Rev. at</p>
        <a 
          href="tel:0240574814" 
          className="font-display text-xl font-bold text-primary hover:text-primary/80 transition-colors"
        >
          0240574814
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Heart className="w-4 h-4 text-accent" />
          <span className="text-sm">Every donation makes a difference</span>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
