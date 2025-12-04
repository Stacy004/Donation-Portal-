import { currencies, CurrencyCode } from "@/lib/currencies";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CurrencySelectorProps {
  selected: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

const CurrencySelector = ({ selected, onChange }: CurrencySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCurrency = currencies[selected];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all",
          "bg-card hover:bg-secondary/50",
          isOpen ? "border-primary" : "border-border"
        )}
      >
        <span className="text-lg">{selectedCurrency.flag}</span>
        <span className="font-semibold text-foreground">{selectedCurrency.code}</span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-card rounded-xl shadow-card border border-border overflow-hidden z-50 animate-fade-up">
          {Object.values(currencies).map((currency) => (
            <button
              key={currency.code}
              type="button"
              onClick={() => {
                onChange(currency.code);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                selected === currency.code
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary/50 text-foreground"
              )}
            >
              <span className="text-xl">{currency.flag}</span>
              <div>
                <p className="font-semibold">{currency.code}</p>
                <p className="text-xs text-muted-foreground">{currency.name}</p>
              </div>
              {selected === currency.code && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
