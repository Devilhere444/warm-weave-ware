import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getVisitorId = () => {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
};

export function useVisitorPresence() {
  const location = useLocation();

  useEffect(() => {
    const visitorId = getVisitorId();
    
    const channel = supabase.channel("live-visitors", {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          visitorId,
          pagePath: location.pathname,
          joinedAt: new Date().toISOString(),
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [location.pathname]);
}
