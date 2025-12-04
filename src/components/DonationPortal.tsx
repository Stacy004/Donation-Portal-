import { useState } from "react";
import AmountSelector from "./AmountSelector";
import DonationForm from "./DonationForm";
import PaymentInstructions from "./PaymentInstructions";
import DonationSuccess from "./DonationSuccess";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyCode } from "@/lib/currencies";

type Step = "amount" | "details" | "payment" | "success";

interface DonorInfo {
  name: string;
  phone: string;
  amount: number;
  currency: CurrencyCode;
  ghsEquivalent: number;
  message: string;
}

const DonationPortal = () => {
  const [step, setStep] = useState<Step>("amount");
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("GHS");
  const [ghsEquivalent, setGhsEquivalent] = useState<number>(0);
  const [donorInfo, setDonorInfo] = useState<DonorInfo | null>(null);

  const handleAmountSelect = (amount: number, currency: CurrencyCode, ghsAmount: number) => {
    setSelectedAmount(amount);
    setSelectedCurrency(currency);
    setGhsEquivalent(ghsAmount);
    setStep("details");
  };

  const handleFormSubmit = (info: { name: string; phone: string; amount: number; message: string }) => {
    setDonorInfo({
      ...info,
      currency: selectedCurrency,
      ghsEquivalent: ghsEquivalent,
    });
    setStep("payment");
  };

  const handlePaymentComplete = () => {
    setStep("success");
  };

  const handleNewDonation = () => {
    setStep("amount");
    setSelectedAmount(0);
    setSelectedCurrency("GHS");
    setGhsEquivalent(0);
    setDonorInfo(null);
  };

  const getStepTitle = () => {
    switch (step) {
      case "amount":
        return "Choose Amount";
      case "details":
        return "Your Details";
      case "payment":
        return "Complete Payment";
      case "success":
        return "Donation Complete";
      default:
        return "";
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case "amount":
        return 1;
      case "details":
        return 2;
      case "payment":
        return 3;
      case "success":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
      {/* Header */}
      {step !== "success" && (
        <div className="bg-primary/5 px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== "amount" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep(step === "payment" ? "details" : "amount")}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Step {getStepNumber()} of 3
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {getStepTitle()}
                </h3>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= getStepNumber() ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {step === "amount" && (
          <AmountSelector onSelect={handleAmountSelect} />
        )}

        {step === "details" && (
          <DonationForm
            selectedAmount={selectedAmount}
            currency={selectedCurrency}
            ghsEquivalent={ghsEquivalent}
            onSubmit={handleFormSubmit}
            onBack={() => setStep("amount")}
          />
        )}

        {step === "payment" && donorInfo && (
          <PaymentInstructions
            amount={donorInfo.amount}
            currency={donorInfo.currency}
            ghsEquivalent={donorInfo.ghsEquivalent}
            donorName={donorInfo.name}
            onComplete={handlePaymentComplete}
            onBack={() => setStep("details")}
          />
        )}

        {step === "success" && donorInfo && (
          <DonationSuccess
            donorName={donorInfo.name}
            amount={donorInfo.amount}
            currency={donorInfo.currency}
            ghsEquivalent={donorInfo.ghsEquivalent}
            onNewDonation={handleNewDonation}
          />
        )}
      </div>
    </div>
  );
};

export default DonationPortal;
