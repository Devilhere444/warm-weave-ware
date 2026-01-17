import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

export default function InviteHero() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Play className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Digital Video Invitations</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground font-outfit mb-6">
            Make Every Occasion <br />
            <span className="text-accent">Unforgettable</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stunning animated video invitations for weddings, birthdays, anniversaries & more. 
            Share instantly via WhatsApp, Instagram, and social media!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>24-48 Hours Delivery</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
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
