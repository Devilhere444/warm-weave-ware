import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InviteCard from "@/components/invites/InviteCard";
import InviteCategoryFilter from "@/components/invites/InviteCategoryFilter";
import InviteHero from "@/components/invites/InviteHero";
import ShareButton from "@/components/invites/ShareButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, X } from "lucide-react";

const ITEMS_PER_PAGE = 12;

interface InviteTemplate {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price: string | null;
  video_url: string;
  thumbnail_url: string | null;
  display_order: number | null;
}

const categoryLabels: Record<string, string> = {
  all: "All Invites",
  wedding: "Wedding",
  birthday: "Birthday",
  anniversary: "Anniversary",
  upnayan: "Upnayan",
  engagement: "Engagement",
  housewarming: "Housewarming",
  mundan: "Mundan",
  baby_shower: "Baby Shower",
  graduation: "Graduation"
};

export default function Invites() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [templates, setTemplates] = useState<InviteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && category !== activeCategory) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("invite_templates")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;

      if (data) {
        setTemplates(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((t) => t.category))];
        setCategories(["all", ...uniqueCategories]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on category change
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  const pageUrl = window.location.href;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <InviteHero />
      
      {/* Search and Share */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search invites by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <ShareButton 
            url={pageUrl} 
            title="Check out these amazing video invitations!" 
          />
        </div>
      </div>

      {/* Category Filter */}
      <InviteCategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        categoryLabels={categoryLabels}
      />

      {/* Templates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? "No invitations match your search." : "No invitations found in this category yet."}
              </p>
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {visibleTemplates.map((template) => (
                    <InviteCard key={template.id} template={template} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Load More / Infinite Scroll Trigger */}
              {hasMore && (
                <div 
                  ref={loaderRef}
                  className="flex flex-col items-center justify-center py-8 gap-4"
                >
                  {loadingMore ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={loadMore}
                      className="min-w-[140px]"
                    >
                      Load More
                    </Button>
                  )}
                </div>
              )}

              {/* Results count */}
              <div className="text-center text-sm text-muted-foreground mt-4">
                Showing {visibleTemplates.length} of {filteredTemplates.length} invites
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
