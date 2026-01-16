import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  token: string;
}

// HTML escape function
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { token }: VerifyRequest = await req.json();

    if (!token || typeof token !== 'string' || token.length !== 64) {
      console.error("Invalid token format");
      return new Response(
        JSON.stringify({ error: 'Invalid token format' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Verifying token:", token.substring(0, 8) + "...");

    // Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('*, quote_requests(*)')
      .eq('token', token)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      console.error("Token not found or expired:", tokenError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Token valid for quote:", tokenData.quote_request_id);

    // Mark token as verified
    const { error: updateTokenError } = await supabase
      .from('email_verification_tokens')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', tokenData.id);

    if (updateTokenError) {
      console.error("Error updating token:", updateTokenError);
    }

    // Mark quote as email verified
    const { error: updateQuoteError } = await supabase
      .from('quote_requests')
      .update({ email_verified: true })
      .eq('id', tokenData.quote_request_id);

    if (updateQuoteError) {
      console.error("Error updating quote:", updateQuoteError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify email' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get quote details to send notifications
    const { data: quote, error: quoteError } = await supabase
      .from('quote_requests')
      .select('*, quote_request_items(*)')
      .eq('id', tokenData.quote_request_id)
      .single();

    if (quoteError || !quote) {
      console.error("Quote not found:", quoteError?.message);
      return new Response(
        JSON.stringify({ success: true, message: 'Email verified, but quote details not found' }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch admin emails
    const { data: adminEmails } = await supabase
      .from("admin_emails")
      .select("email");

    const adminEmailList = adminEmails?.map((a: { email: string }) => a.email) || ["admin@lithoartpress.com"];

    const safeCustomerName = escapeHtml(quote.name || 'Customer');
    const safeCustomerEmail = escapeHtml(quote.email);
    const safeQuoteIdShort = escapeHtml(quote.id.slice(0, 8));

    // Build items HTML
    const items = quote.quote_request_items || [];
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${escapeHtml(item.product_title)}</strong><br>
          <span style="color: #666; font-size: 14px;">
            ${item.finish_option ? `Finish: ${escapeHtml(item.finish_option)}` : ""} 
            ${item.paper_option ? `| Paper: ${escapeHtml(item.paper_option)}` : ""}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
          ${Number(item.quantity)}
        </td>
      </tr>
    `).join('');

    // Send admin notification
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
            <h1 style="color: white; margin: 0; font-size: 24px;">✓ New Verified Quote Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Quote ID: ${safeQuoteIdShort}...</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #155724; margin: 0; font-weight: bold;">✓ Email Verified</p>
            </div>
            
            <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
            <p style="color: #666; margin: 8px 0;"><strong>Name:</strong> ${safeCustomerName}</p>
            <p style="color: #666; margin: 8px 0;"><strong>Email:</strong> ${safeCustomerEmail}</p>
            ${quote.phone ? `<p style="color: #666; margin: 8px 0;"><strong>Phone:</strong> ${escapeHtml(quote.phone)}</p>` : ''}
            
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
            
            ${quote.notes ? `
            <h2 style="color: #333; margin-top: 30px;">Notes</h2>
            <p style="color: #666;">${escapeHtml(quote.notes)}</p>
            ` : ''}
            
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

    // Send admin email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Litho Art Press <onboarding@resend.dev>",
        to: adminEmailList,
        subject: `✓ Verified Quote Request from ${safeCustomerName}`,
        html: adminEmailHtml,
      }),
    });

    // Send customer confirmation
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
            <h1 style="color: white; margin: 0; font-size: 24px;">Email Verified! ✓</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Your quote request is now active</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <p style="color: #666; line-height: 1.6;">
              Hi ${safeCustomerName},
            </p>
            <p style="color: #666; line-height: 1.6;">
              Thank you for verifying your email! Your quote request has been submitted to our team. 
              We'll review your requirements and get back to you within <strong>24 hours</strong> with a detailed quote.
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

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Litho Art Press <onboarding@resend.dev>",
        to: [quote.email],
        subject: "Your email has been verified - Quote request confirmed!",
        html: customerEmailHtml,
      }),
    });

    console.log("Email verification complete and notifications sent");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email verified successfully',
        quote: {
          id: quote.id,
          name: quote.name,
          itemCount: items.length
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-email:", error);
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
