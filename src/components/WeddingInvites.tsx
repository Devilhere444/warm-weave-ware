import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, MessageCircle, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface WeddingInvite {
  id: string;
  title: string;
  description: string;
  price: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const weddingInvites: WeddingInvite[] = [
  {
    id: "1",
    title: "Royal Elegance",
    description: "Traditional golden theme with elegant animations and royal motifs perfect for grand celebrations",
    price: "₹1,499",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-holding-a-bouquet-of-flowers-34421-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80"
  },
  {
    id: "2",
    title: "Modern Romance",
    description: "Contemporary design with smooth transitions, pastel colors and romantic typography",
    price: "₹1,299",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-holding-hands-4698-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80"
  },
  {
    id: "3",
    title: "Floral Dreams",
    description: "Beautiful floral animations with soft music, ideal for garden and destination weddings",
    price: "₹1,199",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-bride-putting-on-her-shoes-34418-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&q=80"
  },
  {
    id: "4",
    title: "Classic Heritage",
    description: "Traditional Indian wedding theme with mandala patterns and cultural elements",
    price: "₹1,699",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-couple-of-newlyweds-at-the-altar-39653-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80"
  }
];

function VideoCard({ invite }: { invite: WeddingInvite }) {
  const { settings } = useSiteSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings.whatsapp_number || "919876543210";
    const message = encodeURIComponent(
      `Hi! I'm interested in the "${invite.title}" wedding invitation video (${invite.price}). Please share more details.`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Video Container - 9:16 aspect ratio */}
      <div 
        className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={togglePlay}
      >
        {/* Thumbnail/Poster */}
        <img 
          src={invite.thumbnailUrl} 
          alt={invite.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* Video */}
        <video
          ref={videoRef}
          src={invite.videoUrl}
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Play/Pause Button */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Price Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm">
          <span className="text-sm font-bold text-white">{invite.price}</span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 font-outfit">{invite.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{invite.description}</p>
        </div>

        {/* Side Actions (like YouTube Shorts) */}
        <div className="absolute right-3 bottom-24 flex flex-col gap-4">
          <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Create Now Button */}
      <Button
        onClick={handleWhatsAppClick}
        className="mt-4 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <MessageCircle className="w-5 h-5" />
        Create Now
      </Button>
    </motion.div>
  );
}

export default function WeddingInvites() {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Digital Wedding Invitations</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground font-outfit mb-4">
            Wedding Video <span className="text-accent">Invitations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make your special day unforgettable with stunning animated wedding invitations. 
            Share instantly via WhatsApp, Instagram, and more!
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {weddingInvites.map((invite) => (
            <VideoCard key={invite.id} invite={invite} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Custom designs available • Delivery in 24-48 hours • Unlimited revisions
          </p>
        </motion.div>
      </div>
    </section>
  );
}
