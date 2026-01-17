import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";

interface InviteTemplate {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: string | null;
  video_url: string;
  thumbnail_url: string | null;
}

// Convert YouTube Shorts URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortsMatch[1]}&controls=0&modestbranding=1&playsinline=1`;
  }
  const regularMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (regularMatch) {
    return `https://www.youtube.com/embed/${regularMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${regularMatch[1]}&controls=0&modestbranding=1&playsinline=1`;
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function VideoCard({ invite }: { invite: InviteTemplate }) {
  const { settings } = useSiteSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const isYouTube = isYouTubeUrl(invite.video_url);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(invite.video_url) : null;

  const togglePlay = () => {
    if (isYouTube) {
      setShowVideo(true);
      setIsPlaying(true);
    } else if (videoRef.current) {
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
      `Hi! I'm interested in the "${invite.title}" ${invite.category} invitation video (${invite.price}). Please share more details.`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isYouTube) {
      setShowVideo(true);
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isYouTube) {
      setShowVideo(false);
      setIsPlaying(false);
    } else if (videoRef.current) {
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
          src={invite.thumbnail_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80"} 
          alt={invite.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${(isPlaying || showVideo) ? 'opacity-0' : 'opacity-100'}`}
        />
        
        {/* YouTube Embed or Video */}
        {isYouTube ? (
          showVideo && youtubeEmbedUrl && (
            <iframe
              src={youtubeEmbedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <video
            ref={videoRef}
            src={invite.video_url}
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Play/Pause Button */}
        {!isYouTube && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </div>
          </div>
        )}

        {/* Mute Button */}
        {!isYouTube && (
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
        )}

        {/* Price Badge */}
        {invite.price && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-accent/90 backdrop-blur-sm">
            <span className="text-sm font-bold text-white">{invite.price}</span>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-1 font-outfit">{invite.title}</h3>
          {invite.description && (
            <p className="text-white/80 text-sm line-clamp-2">{invite.description}</p>
          )}
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
  const [invites, setInvites] = useState<InviteTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      const { data, error } = await supabase
        .from("invite_templates")
        .select("*")
        .eq("is_active", true)
        .eq("category", "wedding")
        .order("display_order")
        .limit(4);

      if (!error && data) {
        setInvites(data);
      }
      setLoading(false);
    };
    fetchInvites();
  }, []);

  if (loading || invites.length === 0) return null;

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
            <span className="text-sm font-medium text-accent">Digital Video Invitations</span>
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
          {invites.map((invite) => (
            <VideoCard key={invite.id} invite={invite} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/invites">
            <Button size="lg" className="gap-2 rounded-full px-8 bg-primary hover:bg-primary/90">
              View All Invitations
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">
            Wedding • Birthday • Anniversary • Upnayan • Engagement & More
          </p>
        </motion.div>
      </div>
    </section>
  );
}
