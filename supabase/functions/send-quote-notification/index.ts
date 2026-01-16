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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, customerName, customerEmail, items }: QuoteNotificationRequest = 
      await req.json();

    console.log("Processing quote notification for:", quoteId);

    // Create Supabase client to fetch admin emails
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch admin emails
    const { data: adminEmails, error: adminError } = await supabase
      .from("admin_emails")
      .select("email");

    if (adminError) {
      console.error("Error fetching admin emails:", adminError);
    }

    const adminEmailList = adminEmails?.map((a: { email: string }) => a.email) || ["admin@lithoartpress.com"];

    // Build items HTML
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            <strong>${item.title}</strong><br>
            <span style="color: #666; font-size: 14px;">
              ${item.finish ? `Finish: ${item.finish}` : ""} 
              ${item.paper ? `| Paper: ${item.paper}` : ""}
            </span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
        </tr>
      `
      )
      .join("");

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
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Quote ID: ${quoteId.slice(0, 8)}...</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
            <p style="color: #666; margin: 8px 0;"><strong>Name:</strong> ${customerName}</p>
            <p style="color: #666; margin: 8px 0;"><strong>Email:</strong> ${customerEmail}</p>
            
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
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You, ${customerName}!</h1>
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
                <strong>Reference:</strong> ${quoteId.slice(0, 8)}<br>
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
        subject: `New Quote Request from ${customerName}`,
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
