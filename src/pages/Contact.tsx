import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-sm font-elegant tracking-widest uppercase text-accent mb-4">
              Contact Us
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
              Let's Start Your
              <span className="text-gradient-gold block">Project</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              Have a project in mind? Reach out to us and let's create something
              extraordinary together.
            </p>
          </motion.div>
        </div>
      </section>

      <ContactSection />

      {/* Map */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.8!2d87.5647!3d25.5439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef5b00c6b7a8f7%3A0x7db5d8e0e3b5a6c0!2sGHRC%2B88%20Katihar%2C%20Bihar!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Litho Art Press Location - Katihar, Bihar"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
