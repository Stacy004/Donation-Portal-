import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MessageSquare, ArrowRight } from "lucide-react";
import { CurrencyCode, formatCurrency } from "@/lib/currencies";

interface DonorInfo {
  name: string;
  email: string;
  phone: string;
  amount: number;
  message: string;
}

interface DonationFormProps {
  selectedAmount: number;
  currency: CurrencyCode;
  ghsEquivalent: number;
  onSubmit: (donorInfo: DonorInfo) => void;
  onBack: () => void;
}

const DonationForm = ({ selectedAmount, currency, ghsEquivalent, onSubmit, onBack }: DonationFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (message.length > 500) {
      newErrors.message = "Message must be less than 500 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount: selectedAmount,
        message: message.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl p-4 border border-accent/20">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Donation Amount</p>
          <p className="font-display text-2xl font-bold text-accent">
            {formatCurrency(selectedAmount, currency)}
          </p>
          {currency !== "GHS" && (
            <div className="flex items-center justify-center gap-2 mt-1 text-sm text-muted-foreground">
              <ArrowRight className="w-3 h-3" />
              <span>≈ GHS {ghsEquivalent.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-medium">
          Full Name *
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10"
            maxLength={100}
          />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">
          Email *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium">
          Phone Number *
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+233 XX XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-10"
            maxLength={15}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground font-medium">
          Message (Optional)
        </Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Textarea
            id="message"
            placeholder="Leave a message of support..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pl-10 min-h-[100px] resize-none"
            maxLength={500}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">
          {message.length}/500
        </p>
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button type="submit" variant="donate" className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </form>
  );
};

export default DonationForm;
