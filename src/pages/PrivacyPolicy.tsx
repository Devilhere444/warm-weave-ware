import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function PrivacyPolicy() {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground font-body">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto prose prose-lg dark:prose-invert"
          >
            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Welcome to {settings.site_name}. We are committed to protecting your personal information 
                  and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
                  and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  2. Information We Collect
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-body">
                  <li>Name and contact information (email address, phone number, address)</li>
                  <li>Quote request details and project specifications</li>
                  <li>Communication records when you contact us</li>
                  <li>Account information if you create an account</li>
                  <li>Payment information for completed orders</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-body">
                  <li>Process and fulfill your printing orders</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you updates about your orders and services</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  4. Information Sharing
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-body mt-4">
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With your consent</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  5. Data Security
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. However, 
                  no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  6. Your Rights
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-body">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  7. Cookies
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  8. Contact Us
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-body text-foreground font-semibold">{settings.site_name}</p>
                  {settings.contact_email && (
                    <p className="text-muted-foreground font-body">Email: {settings.contact_email}</p>
                  )}
                  {settings.contact_phone && (
                    <p className="text-muted-foreground font-body">Phone: {settings.contact_phone}</p>
                  )}
                  {settings.contact_address && (
                    <p className="text-muted-foreground font-body">Address: {settings.contact_address}</p>
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
