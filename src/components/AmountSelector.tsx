import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import CurrencySelector from "./CurrencySelector";
import { CurrencyCode, currencies, convertToGHS, formatCurrency } from "@/lib/currencies";
import { ArrowRight } from "lucide-react";

const presetAmountsByGurrency: Record<CurrencyCode, number[]> = {
  GHS: [50, 100, 200, 500, 1000],
  USD: [5, 10, 25, 50, 100],
  EUR: [5, 10, 25, 50, 100],
  GBP: [5, 10, 20, 50, 100],
};

interface AmountSelectorProps {
  onSelect: (amount: number, currency: CurrencyCode, ghsEquivalent: number) => void;
}

const AmountSelector = ({ onSelect }: AmountSelectorProps) => {
  const [currency, setCurrency] = useState<CurrencyCode>("GHS");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const presetAmounts = presetAmountsByGurrency[currency];

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCustomAmount(value);
    setSelectedPreset(null);
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    setSelectedPreset(null);
    setCustomAmount("");
  };

  const handleContinue = () => {
    const amount = selectedPreset || parseFloat(customAmount);
    if (amount && amount >= 1) {
      const ghsEquivalent = convertToGHS(amount, currency);
      onSelect(amount, currency, ghsEquivalent);
    }
  };

  const currentAmount = selectedPreset || parseFloat(customAmount) || 0;
  const ghsEquivalent = convertToGHS(currentAmount, currency);
  const isValid = currentAmount >= 1;

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <div className="flex items-center justify-between">
        <Label className="text-foreground font-medium">Select Currency</Label>
        <CurrencySelector selected={currency} onChange={handleCurrencyChange} />
      </div>

      {/* Amount Selection */}
      <div>
        <Label className="text-foreground font-medium mb-3 block">
          Select Amount ({currency})
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              className={cn(
                "py-4 px-3 rounded-xl font-semibold text-lg transition-all duration-200 border-2",
                selectedPreset === amount
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-secondary/50 text-foreground border-transparent hover:border-primary/30 hover:bg-secondary"
              )}
            >
              {currencies[currency].symbol}{amount}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedPreset(null);
              document.getElementById("custom-amount")?.focus();
            }}
            className={cn(
              "py-4 px-3 rounded-xl font-semibold text-lg transition-all duration-200 border-2",
              !selectedPreset && customAmount
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-secondary/50 text-foreground border-transparent hover:border-primary/30 hover:bg-secondary"
            )}
          >
            Other
          </button>
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="custom-amount" className="text-foreground font-medium">
          Or enter custom amount
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {currencies[currency].symbol}
          </span>
          <Input
            id="custom-amount"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={customAmount}
            onChange={handleCustomChange}
            className="pl-10 text-lg font-semibold h-14"
          />
        </div>
      </div>

      {/* Amount Summary */}
      {currentAmount > 0 && (
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-5 border border-accent/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">You're donating</p>
            <p className="font-display text-3xl font-bold text-accent mt-1">
              {formatCurrency(currentAmount, currency)}
            </p>
            {currency !== "GHS" && (
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                <ArrowRight className="w-3 h-3" />
                <span>≈ GHS {ghsEquivalent.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        variant="donate"
        className="w-full"
        onClick={handleContinue}
        disabled={!isValid}
      >
        Continue.
      </Button>
    </div>
  );
};

export default AmountSelector;
