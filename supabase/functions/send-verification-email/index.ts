import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  quoteId: string;
  email: string;
  customerName: string;
}

// HTML escape function to prevent XSS attacks
function escapeHtml(text: string): string {
  if (!text) return "";
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Generate secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Input validation
function validateInput(data: VerificationRequest): string | null {
  if (!data.quoteId || typeof data.quoteId !== 'string') {
    return 'Invalid quoteId';
  }
  if (!data.email || typeof data.email !== 'string' || data.email.length > 255) {
    return 'Invalid email (max 255 characters)';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return 'Invalid email format';
  }
  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.length > 200) {
    return 'Invalid customerName (max 200 characters)';
  }
  return null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: VerificationRequest = await req.json();
    
    // Validate input data
    const validationError = validateInput(requestData);
    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { quoteId, email, customerName } = requestData;

    console.log("Creating verification token for quote:", quoteId);

    // Verify the quote exists
    const { data: quote, error: quoteError } = await supabase
      .from('quote_requests')
      .select('id, email')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error("Quote not found:", quoteError?.message);
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if email matches
    if (quote.email !== email) {
      console.error("Email mismatch for quote");
      return new Response(
        JSON.stringify({ error: 'Email mismatch' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Generate verification token
    const token = generateToken();

    // Insert token into database
    const { error: tokenError } = await supabase
      .from('email_verification_tokens')
      .insert({
        quote_request_id: quoteId,
        token: token,
        email: email,
      });

    if (tokenError) {
      console.error("Error creating token:", tokenError);
      return new Response(
        JSON.stringify({ error: 'Failed to create verification token' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Build verification URL - use the app URL
    const appUrl = Deno.env.get("SITE_URL") || "https://warm-weave-ware.lovable.app";
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

    const safeCustomerName = escapeHtml(customerName);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #C4846C, #D4A574); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Verify Your Email</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">One more step to complete your quote request</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <p style="color: #666; line-height: 1.6;">
              Hi ${safeCustomerName},
            </p>
            <p style="color: #666; line-height: 1.6;">
              Thank you for your interest in our services! Please verify your email address to complete your quote request.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #C4846C, #D4A574); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Verify My Email
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; line-height: 1.6;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #C4846C; font-size: 14px; word-break: break-all;">
              ${verificationUrl}
            </p>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f9f5f0; border-radius: 8px;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                ⏰ This link expires in 24 hours.<br>
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © Litho Art Press - Premium Printing Solutions
          </p>
        </div>
      </body>
      </html>
    `;

    // Send verification email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Litho Art Press <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your email to complete your quote request",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Verification email sent:", emailResult);

    if (!emailResponse.ok) {
      console.error("Resend error:", emailResult);
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Verification email sent' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
