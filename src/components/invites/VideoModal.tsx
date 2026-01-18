import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface InviteTemplate {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: string | null;
  video_url: string;
  thumbnail_url: string | null;
}

// Convert YouTube Shorts URL to embed URL for fullscreen
function getYouTubeEmbedUrl(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&loop=1&playlist=${shortsMatch[1]}&controls=1&modestbranding=1&playsinline=1`;
  }
  
  const regularMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (regularMatch) {
    return `https://www.youtube.com/embed/${regularMatch[1]}?autoplay=1&loop=1&playlist=${regularMatch[1]}&controls=1&modestbranding=1&playsinline=1`;
  }
  
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

interface VideoModalProps {
  template: InviteTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ template, isOpen, onClose }: VideoModalProps) {
  const { settings } = useSiteSettings();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!template) return null;

  const isYouTube = isYouTubeUrl(template.video_url);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(template.video_url) : null;

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings.whatsapp_number || "919876543210";
    const message = encodeURIComponent(
      `Hi! I'm interested in the "${template.title}" ${template.category} invitation video (${template.price}). Please share more details.`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Video Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[400px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 9:16 Video Container */}
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
              {isYouTube && youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={template.video_url}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Gradient Overlay for Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pointer-events-none">
                {/* Price Badge */}
                {template.price && (
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/90 mb-2">
                    <span className="text-sm font-bold text-white">{template.price}</span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1 font-outfit">{template.title}</h3>
                {template.description && (
                  <p className="text-white/80 text-sm line-clamp-2">{template.description}</p>
                )}
              </div>
            </div>

            {/* Create Now Button */}
            <Button
              onClick={handleWhatsAppClick}
              className="mt-4 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Create Now on WhatsApp
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
