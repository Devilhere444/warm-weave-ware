import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteNotificationRequest {
  quoteId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    title: string;
    quantity: number;
    finish?: string;
    paper?: string;
  }>;
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

// Input validation
function validateInput(data: QuoteNotificationRequest): string | null {
  if (!data.quoteId || typeof data.quoteId !== 'string') {
    return 'Invalid quoteId';
  }
  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.length > 200) {
    return 'Invalid customerName (max 200 characters)';
  }
  if (!data.customerEmail || typeof data.customerEmail !== 'string' || data.customerEmail.length > 255) {
    return 'Invalid customerEmail (max 255 characters)';
  }
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.customerEmail)) {
    return 'Invalid email format';
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return 'Items array is required';
  }
  for (const item of data.items) {
    if (!item.title || typeof item.title !== 'string' || item.title.length > 500) {
      return 'Invalid item title (max 500 characters)';
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      return 'Invalid item quantity';
    }
  }
  return null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - verify the request has a valid JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with user's auth token for verification
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Use anon key with user's token to verify authentication
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user's token is valid
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message || "No user found");
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Authenticated user:", user.id);

    const requestData: QuoteNotificationRequest = await req.json();
    
    // Validate input data
    const validationError = validateInput(requestData);
    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { quoteId, customerName, customerEmail, items } = requestData;

    // Use service role client for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the quote exists and belongs to this user (or user is admin)
    const { data: quote, error: quoteError } = await supabase
      .from('quote_requests')
      .select('id, user_id, email')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      console.error("Quote not found:", quoteError?.message);
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if user owns the quote or is an admin
    const { data: isAdmin } = await supabase.rpc('has_role', { 
      _user_id: user.id, 
      _role: 'admin' 
    });

    if (quote.user_id !== user.id && !isAdmin) {
      console.error("User does not own this quote and is not admin");
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing quote notification for:", quoteId);

    // Fetch admin emails
    const { data: adminEmails, error: adminError } = await supabase
      .from("admin_emails")
      .select("email");

    if (adminError) {
      console.error("Error fetching admin emails:", adminError);
    }

    const adminEmailList = adminEmails?.map((a: { email: string }) => a.email) || ["admin@lithoartpress.com"];

    // Build items HTML with escaped values to prevent XSS
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${escapeHtml(item.title)}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${item.finish ? `Finish: ${escapeHtml(item.finish)}` : ""} 
              ${item.paper ? `| Paper: ${escapeHtml(item.paper)}` : ""}
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${Number(item.quantity)}
          </td>
        </tr>
      `
      )
      .join("");

    // Escape all user-provided values
    const safeCustomerName = escapeHtml(customerName);
    const safeCustomerEmail = escapeHtml(customerEmail);
    const safeQuoteIdShort = escapeHtml(quoteId.slice(0, 8));

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #C4846C, #D4A574); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Quote Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Quote ID: ${safeQuoteIdShort}...</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
            <p style="color: #666; margin: 8px 0;"><strong>Name:</strong> ${safeCustomerName}</p>
            <p style="color: #666; margin: 8px 0;"><strong>Email:</strong> ${safeCustomerEmail}</p>
            
            <h2 style="color: #333; margin-top: 30px;">Requested Items</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #f9f5f0;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #C4846C;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #C4846C;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f9f5f0; border-radius: 8px; text-align: center;">
              <p style="color: #666; margin: 0;">Please respond to this quote request within 24 hours.</p>
            </div>
          </div>
          
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            © Litho Art Press - Premium Printing Solutions
          </p>
        </div>
      </body>
      </html>
    `;

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #C4846C, #D4A574); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${safeCustomerName}!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your quote request has been received</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <p style="color: #666; line-height: 1.6;">
              We've received your quote request for ${items.length} item${items.length > 1 ? "s" : ""}. 
              Our team will review your requirements and get back to you within <strong>24 hours</strong> with a detailed quote.
            </p>
            
            <h2 style="color: #333; margin-top: 30px;">Your Request Summary</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <thead>
                <tr style="background-color: #f9f5f0;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #C4846C;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #C4846C;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f9f5f0; border-radius: 8px;">
              <p style="color: #666; margin: 0; line-height: 1.6;">
                <strong>Reference:</strong> ${safeQuoteIdShort}<br>
                If you have any questions, feel free to reply to this email.
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

    // Send email to admin using Resend API directly
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Litho Art Press <onboarding@resend.dev>",
        to: adminEmailList,
        subject: `New Quote Request from ${safeCustomerName}`,
        html: adminEmailHtml,
      }),
    });

    const adminResult = await adminEmailResponse.json();
    console.log("Admin email sent:", adminResult);

    // Send confirmation email to customer
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Litho Art Press <onboarding@resend.dev>",
        to: [customerEmail],
        subject: "We received your quote request!",
        html: customerEmailHtml,
      }),
    });

    const customerResult = await customerEmailResponse.json();
    console.log("Customer email sent:", customerResult);

    return new Response(
      JSON.stringify({ success: true, adminEmail: adminResult, customerEmail: customerResult }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-notification:", error);
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