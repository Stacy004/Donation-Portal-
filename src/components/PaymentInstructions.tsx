import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Smartphone, Building2, ArrowLeft, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CurrencyCode, formatCurrency } from "@/lib/currencies";

interface PaymentInstructionsProps {
  amount: number;
  currency: CurrencyCode;
  ghsEquivalent: number;
  donorName: string;
  onComplete: () => void;
  onBack: () => void;
}

type PaymentMethod = "momo" | "bank";

const PaymentInstructions = ({ amount, currency, ghsEquivalent, donorName, onComplete, onBack }: PaymentInstructionsProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(currency === "GHS" ? "momo" : "bank");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const momoDetails = {
    number: "0593252660",
    name: "Mentors Foundation",
  };

  const bankAccounts = {
    local: {
      
      branch: "Accra Main Branch",
      accountNumber: "1400005269735",
      accountName: "Mentors Foundation",
      accountType: "Current Account",
      bankType: "CalBank",
       correspondentSwift: "CITIUS33",
    },
    international: {
      
      accountNumber: "1441001234567",
      accountName: "Mentors Foundation",
      swiftCode: "GCBLGHAC",
      iban: "GH82GCBL1441001234567",
      bankAddress: "Thorpe Road, High Street, Accra, Ghana",
      correspondentBank: "Citibank N.A., New York",
      correspondentSwift: "CITIUS33",
    },
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      className="p-2 rounded-lg bg-background hover:bg-muted transition-colors shrink-0"
      aria-label={`Copy ${field}`}
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-primary" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

  const DetailRow = ({ label, value, copyable = false, mono = false }: { label: string; value: string; copyable?: boolean; mono?: boolean }) => (
    <div className="bg-secondary/50 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className={cn(
            "font-semibold text-foreground mt-0.5",
            mono && "font-mono tracking-wide",
            copyable && "text-lg"
          )}>
            {value}
          </p>
        </div>
        {copyable && <CopyButton text={value} field={label} />}
      </div>
    </div>
  );

  const isInternationalDonor = currency !== "GHS";

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-5 text-center border border-accent/20">
        <p className="text-sm text-muted-foreground">Amount to transfer</p>
        <p className="font-display text-3xl font-bold text-accent mt-1">
          {formatCurrency(amount, currency)}
        </p>
        {isInternationalDonor && (
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
            <ArrowRight className="w-3 h-3" />
            <span>≈ GHS {ghsEquivalent.toLocaleString()}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">from {donorName}</p>
      </div>

      {/* Payment Method Tabs */}
      <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setPaymentMethod("momo")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-medium transition-all",
            paymentMethod === "momo"
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="w-5 h-5" />
          Mobile Money
        </button>
        <button
          onClick={() => setPaymentMethod("bank")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg font-medium transition-all",
            paymentMethod === "bank"
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Building2 className="w-5 h-5" />
          Bank Transfer
        </button>
      </div>

      {/* International Donor Notice */}
      {isInternationalDonor && paymentMethod === "momo" && (
        <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-xl border border-accent/20">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground text-sm">International Donor?</p>
            <p className="text-xs text-muted-foreground mt-1">
              We currently do not provide direct international wire transfer details in-app. Please contact <span className="font-semibold text-foreground">donations@mentorsfoundation.org</span> for assistance.
            </p>
          </div>
        </div>
      )}

      {/* Payment Details */}
      {paymentMethod === "momo" ? (
        <div className="space-y-3 animate-fade-up">
          {/* MTN Header */}
          <div className="flex items-center gap-3 p-3 bg-[#FFCC00]/10 rounded-xl border border-[#FFCC00]/30">
            <div className="w-10 h-10 rounded-lg bg-[#FFCC00] flex items-center justify-center">
              <span className="font-bold text-black text-sm">MTN</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">MTN Mobile Money</p>
              <p className="text-xs text-muted-foreground">Instant & Secure Transfer</p>
            </div>
          </div>

          <DetailRow label="MoMo Number" value={momoDetails.number} copyable mono />
          <DetailRow label="Account Name" value={momoDetails.name} />

          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              How to Transfer
            </h4>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">1.</span>
                Dial *170# on your MTN line
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">2.</span>
                Select "Transfer Money" → "MoMo User"
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">3.</span>
                Enter number: <span className="font-mono font-semibold text-foreground">{momoDetails.number}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">4.</span>
                Enter amount: <span className="font-semibold text-foreground">GHS {ghsEquivalent.toLocaleString()}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">5.</span>
                Reference: <span className="font-semibold text-foreground">Project 2026</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">6.</span>
                Confirm with your PIN
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-up">
          

          {/* Local Transfer Section */}
          {!isInternationalDonor && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Building2 className="w-4 h-4 text-primary" />
                Local Bank Transfer (Ghana)
              </div>
              
              <DetailRow label="Account Name" value={bankAccounts.local.accountName} />
              <DetailRow label="Account Number" value={bankAccounts.local.accountNumber} copyable mono />
              <DetailRow label="Account Type" value={bankAccounts.local.accountType} />
              <DetailRow label="Bank Type" value={bankAccounts.local.bankType} />
              
            </div>
          )}

        


          {isInternationalDonor && (
            <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
              <p className="font-medium text-foreground text-sm">International Transfers</p>
              <p className="text-xs text-muted-foreground mt-1">
                We currently do not provide direct international wire transfer details through this form. Please contact us at <span className="font-semibold text-foreground">donations@mentorsfoundation.org</span> for assistance or use an alternative local transfer method where possible.
              </p>
            </div>
          )}

          {/* Reference Note */}
          <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-accent" />
              Payment Reference
            </h4>
            <p className="text-sm text-muted-foreground">
              Please include <span className="font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">"Project 2026 "</span> as your payment reference.
            </p>
          </div>

          {/* Processing Time Note */}
          <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Processing Time:</span> Local transfers typically complete within 24 hours.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button variant="donate" onClick={onComplete} className="flex-1">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          I've Made Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentInstructions;
