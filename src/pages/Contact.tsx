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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.90365692044!2d85.0492675!3d25.5940947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dce6732867%3A0x4059f39a1ac82f06!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Litho Art Press Location"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
