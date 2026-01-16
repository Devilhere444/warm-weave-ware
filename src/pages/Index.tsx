import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PullToRefresh from "@/components/PullToRefresh";

const Index = () => {
  const queryClient = useQueryClient();

  const handleRefresh = useCallback(async () => {
    // Invalidate all queries to refresh data
    await queryClient.invalidateQueries();
    // Small delay to show the refresh animation
    await new Promise(resolve => setTimeout(resolve, 500));
  }, [queryClient]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <FeaturedProducts />
        <About />
        <ContactSection />
        <Footer />
      </div>
    </PullToRefresh>
  );
};

export default Index;
