import { Heart, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <header className="text-center mb-12 animate-fade-up">
      <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        <span>Orphanage Donation portal</span>
      </div>
      
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
        Support the Orphans Project- Ghana
        {/* <span className="block text-primary">Make a Donation</span> */}
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Your generosity helps transform the lives of {" "}
        <span className="text-foreground font-medium">Orphans in Ghana</span>. 
        Every contribution, big or small, brings hope and opportunity to those who need it most.
      </p>
      
      <div className="flex items-center justify-center gap-2 mt-8 text-primary">
        <Heart className="w-5 h-5 fill-current" />
        <span className="font-medium">Mentors Foundation</span>
      </div>
    </header>
  );
};

export default HeroSection;
