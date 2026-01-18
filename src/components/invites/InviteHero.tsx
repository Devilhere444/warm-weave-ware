import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

export default function InviteHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background">
      {/* Decorative Elements - Blue theme */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/12 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Digital Video Invitations</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground font-outfit mb-6">
            Make Every Occasion <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Unforgettable</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stunning animated video invitations for weddings, birthdays, anniversaries & more. 
            Share instantly via WhatsApp, Instagram, and social media!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>24-48 Hours Delivery</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Unlimited Revisions</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Custom Designs</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
