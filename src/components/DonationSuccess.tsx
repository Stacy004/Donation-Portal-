import { Button } from "@/components/ui/button";
import { CheckCircle2, Heart, Share2, RotateCcw, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CurrencyCode, formatCurrency } from "@/lib/currencies";

interface DonationSuccessProps {
  donorName: string;
  amount: number;
  currency: CurrencyCode;
  ghsEquivalent: number;
  onNewDonation: () => void;
}

const DonationSuccess = ({ donorName, amount, currency, ghsEquivalent, onNewDonation }: DonationSuccessProps) => {
  const handleShare = async () => {
    const shareText = `I just donated ${formatCurrency(amount, currency)} to support Project 2026 at Nyamedua Children's Home through Mentors Foundation! Join me in making a difference.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Support Project 2026",
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText + " " + window.location.href);
        toast({
          title: "Link Copied!",
          description: "Share message copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Share",
          description: shareText,
        });
      }
    }
  };

  return (
    <div className="text-center py-8 animate-fade-up">
      {/* Success Icon */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-primary" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-glow">
          <Heart className="w-5 h-5 text-accent-foreground fill-current" />
        </div>
      </div>

      {/* Message */}
      <h2 className="font-display text-3xl font-bold text-foreground mb-3">
        Thank You, {donorName}!
      </h2>
      
      <p className="text-muted-foreground text-lg mb-2">
        Your generosity means the world to us.
      </p>

      <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-5 my-6 inline-block border border-accent/20">
        <p className="text-sm text-muted-foreground">Your donation of</p>
        <p className="font-display text-3xl font-bold text-accent mt-1">
          {formatCurrency(amount, currency)}
        </p>
        {currency !== "GHS" && (
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <ArrowRight className="w-3 h-3" />
            <span>≈ GHS {ghsEquivalent.toLocaleString()}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          will help transform lives at Nyamedua Children's Home
        </p>
      </div>

      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        Once we confirm your payment, you'll receive a confirmation message. 
        Thank you for supporting Project 2026!
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 max-w-xs mx-auto">
        <Button variant="donate" onClick={handleShare} className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Share & Inspire Others
        </Button>
        
        <Button variant="outline" onClick={onNewDonation} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Make Another Donation
        </Button>
      </div>

      {/* Contact Info */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Questions? Contact Rev. at{" "}
          <a href="tel:0240574814" className="text-primary font-medium hover:underline">
            0240574814
          </a>
        </p>
      </div>
    </div>
  );
};

export default DonationSuccess;
