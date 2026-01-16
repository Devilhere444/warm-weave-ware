import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function TermsOfService() {
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
              Terms of Service
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
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  By accessing and using the services of {settings.site_name}, you accept and agree to be 
                  bound by the terms and provision of this agreement. If you do not agree to abide by 
                  these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  2. Services Description
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  {settings.site_name} provides professional printing services including but not limited to 
                  book printing, packaging, stationery, invitations, commercial printing, and labels. 
                  All services are subject to availability and our acceptance of your order.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  3. Ordering and Payment
                </h2>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground font-body">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>Prices are subject to change without prior notice</li>
                  <li>A deposit may be required for large orders</li>
                  <li>Payment terms will be communicated during the quotation process</li>
                  <li>Orders will not proceed until payment arrangements are confirmed</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  4. Artwork and Files
                </h2>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground font-body">
                  <li>Customers are responsible for providing print-ready artwork</li>
                  <li>We are not responsible for errors in customer-supplied files</li>
                  <li>Proofs should be carefully reviewed before approval</li>
                  <li>Additional charges may apply for artwork corrections</li>
                  <li>Files should meet our technical specifications</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  5. Proofing and Approval
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  We provide digital proofs for review before printing. Once you approve a proof, 
                  we are not liable for any errors that were present in the approved proof. 
                  Please review all proofs carefully for spelling, grammar, layout, and content accuracy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  6. Delivery and Turnaround
                </h2>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground font-body">
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Turnaround begins after proof approval and payment confirmation</li>
                  <li>We are not responsible for delays caused by shipping carriers</li>
                  <li>Rush orders may be available at additional cost</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  7. Quality and Variations
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  We strive for the highest quality in all our printing. However, slight variations 
                  in color, paper, and finishing may occur between orders and are inherent to the 
                  printing process. Such variations do not constitute defects.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  8. Cancellations and Refunds
                </h2>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground font-body">
                  <li>Cancellations must be made before production begins</li>
                  <li>A cancellation fee may apply based on work completed</li>
                  <li>Custom orders are non-refundable once production starts</li>
                  <li>Defective products will be reprinted or refunded</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  9. Intellectual Property
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Customers warrant that they have the right to reproduce all content provided for printing. 
                  We are not liable for copyright infringement by customers. We reserve the right to 
                  refuse orders that may violate intellectual property rights.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  10. Limitation of Liability
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Our liability for any claim arising from our services shall not exceed the amount 
                  paid for the specific order in question. We are not liable for any indirect, 
                  incidental, or consequential damages.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  11. Governing Law
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  These terms shall be governed by and construed in accordance with the laws of India. 
                  Any disputes arising from these terms shall be subject to the exclusive jurisdiction 
                  of the courts in Bihar.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  12. Changes to Terms
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective 
                  immediately upon posting to our website. Your continued use of our services 
                  constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                  13. Contact Information
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed">
                  For questions about these Terms of Service, please contact us:
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
