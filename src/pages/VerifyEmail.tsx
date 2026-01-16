import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Home, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type VerificationStatus = "loading" | "success" | "error" | "expired";

interface QuoteInfo {
  id: string;
  name: string;
  itemCount: number;
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [quoteInfo, setQuoteInfo] = useState<QuoteInfo | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token provided");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-email", {
          body: { token },
        });

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
          setErrorMessage(error.message || "Verification failed");
          return;
        }

        if (data.error) {
          if (data.error.includes("expired")) {
            setStatus("expired");
          } else {
            setStatus("error");
          }
          setErrorMessage(data.error);
          return;
        }

        setStatus("success");
        if (data.quote) {
          setQuoteInfo(data.quote);
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setErrorMessage("An unexpected error occurred");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            {status === "loading" && (
              <div className="p-12 bg-card rounded-2xl border border-border shadow-lg">
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
                <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                  Verifying Your Email
                </h1>
                <p className="text-muted-foreground font-body">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="p-12 bg-card rounded-2xl border border-border shadow-lg">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                  Email Verified!
                </h1>
                <p className="text-muted-foreground font-body mb-6">
                  Thank you for verifying your email. Your quote request has been submitted to our team and you'll receive a response within 24 hours.
                </p>
                
                {quoteInfo && (
                  <div className="p-4 bg-secondary/50 rounded-lg mb-6 text-left">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Name:</span> {quoteInfo.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Items:</span> {quoteInfo.itemCount} product(s)
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Reference:</span> {quoteInfo.id.slice(0, 8)}...
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button variant="outline" className="font-elegant w-full sm:w-auto">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button className="font-elegant w-full sm:w-auto">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "expired" && (
              <div className="p-12 bg-card rounded-2xl border border-border shadow-lg">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                  Link Expired
                </h1>
                <p className="text-muted-foreground font-body mb-6">
                  This verification link has expired. Verification links are valid for 24 hours. Please submit a new quote request to receive a fresh verification link.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/cart">
                    <Button className="font-elegant w-full sm:w-auto">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Submit New Quote
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="p-12 bg-card rounded-2xl border border-border shadow-lg">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                  Verification Failed
                </h1>
                <p className="text-muted-foreground font-body mb-2">
                  We couldn't verify your email address.
                </p>
                <p className="text-sm text-destructive mb-6">
                  {errorMessage}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button variant="outline" className="font-elegant w-full sm:w-auto">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button className="font-elegant w-full sm:w-auto">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
