import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, MessageCircle, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import ShareButton from "./ShareButton";
import VideoModal from "./VideoModal";

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
  // Handle YouTube Shorts URLs
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${shortsMatch[1]}&controls=0&modestbranding=1&playsinline=1`;
  }
  
  // Handle regular YouTube URLs
  const regularMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (regularMatch) {
    return `https://www.youtube.com/embed/${regularMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${regularMatch[1]}&controls=0&modestbranding=1&playsinline=1`;
  }
  
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

interface InviteCardProps {
  template: InviteTemplate;
  onOpenModal?: (template: InviteTemplate) => void;
}

export default function InviteCard({ template, onOpenModal }: InviteCardProps) {
  const { settings } = useSiteSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isYouTube = isYouTubeUrl(template.video_url);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(template.video_url) : null;

  const handleOpenFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenModal) {
      onOpenModal(template);
    } else {
      setModalOpen(true);
    }
  };

  const handlePlay = () => {
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
      `Hi! I'm interested in the "${template.title}" ${template.category} invitation video (${template.price}). Please share more details.`
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

  const shareUrl = `${window.location.origin}/invites?highlight=${template.id}`;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col"
      >
        {/* Video Container - 9:16 aspect ratio */}
        <div 
          className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl group cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleOpenFullscreen}
        >
          {/* Thumbnail/Poster */}
          <img 
            src={template.thumbnail_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80"} 
            alt={template.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              (isPlaying || showVideo) ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* YouTube Embed or Video */}
          {isYouTube ? (
            showVideo && youtubeEmbedUrl && (
              <iframe
                src={youtubeEmbedUrl}
                className="absolute inset-0 w-full h-full pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <video
              ref={videoRef}
              src={template.video_url}
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Fullscreen Button */}
          <button
            onClick={handleOpenFullscreen}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>

          {/* Play/Pause Indicator */}
          {!isYouTube && (
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
              isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-white" />
                ) : (
                  <Play className="w-7 h-7 text-white ml-1" />
                )}
              </div>
            </div>
          )}

          {/* Mute Button (for non-YouTube) */}
          {!isYouTube && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="absolute top-12 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          )}

          {/* Price Badge */}
          {template.price && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent/90 backdrop-blur-sm">
              <span className="text-xs font-bold text-white">{template.price}</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-12 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm">
            <span className="text-[10px] font-medium text-white/80 capitalize">{template.category}</span>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-base font-bold text-white mb-0.5 font-outfit line-clamp-1">{template.title}</h3>
            {template.description && (
              <p className="text-white/70 text-xs line-clamp-2">{template.description}</p>
            )}
          </div>

          {/* Side Actions */}
          <div className="absolute right-2 bottom-20 flex flex-col gap-3">
            <ShareButton 
              url={shareUrl} 
              title={`Check out this ${template.title} invitation!`}
              compact
            />
          </div>
        </div>

        {/* Create Now Button */}
        <Button
          onClick={handleWhatsAppClick}
          className="mt-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Create Now
        </Button>
      </motion.div>

      {/* Fullscreen Modal (standalone mode) */}
      {!onOpenModal && (
        <VideoModal 
          template={template} 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </>
  );
}
