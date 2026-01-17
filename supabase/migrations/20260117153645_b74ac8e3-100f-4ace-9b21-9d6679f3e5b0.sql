-- Create invite_templates table for storing video invitations
CREATE TABLE public.invite_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(50),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.invite_templates ENABLE ROW LEVEL SECURITY;

-- Public can view active templates
CREATE POLICY "Anyone can view active invite templates" 
ON public.invite_templates 
FOR SELECT 
USING (is_active = true);

-- Admins can manage all templates
CREATE POLICY "Admins can manage invite templates" 
ON public.invite_templates 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invite_templates_updated_at
BEFORE UPDATE ON public.invite_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.invite_templates (category, title, description, price, video_url, thumbnail_url, display_order) VALUES
('wedding', 'Royal Elegance', 'Traditional golden theme with elegant animations and royal motifs', '₹1,499', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', 1),
('wedding', 'Modern Romance', 'Contemporary design with smooth transitions and pastel colors', '₹1,299', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80', 2),
('birthday', 'Fun Celebration', 'Colorful and vibrant birthday invitation with balloons', '₹799', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', 1),
('birthday', 'Kids Party', 'Animated cartoon theme perfect for children birthdays', '₹699', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=400&q=80', 2),
('anniversary', 'Golden Moments', 'Elegant anniversary celebration with golden accents', '₹999', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80', 1),
('upnayan', 'Sacred Thread', 'Traditional Upanayana ceremony invitation with vedic motifs', '₹1,199', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=400&q=80', 1),
('engagement', 'Ring Ceremony', 'Beautiful engagement invitation with ring animations', '₹899', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80', 1),
('housewarming', 'New Beginnings', 'Griha Pravesh invitation with traditional elements', '₹799', 'https://www.youtube.com/shorts/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&q=80', 1);