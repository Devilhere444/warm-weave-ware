import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LiveVisitor {
  visitorId: string;
  pagePath: string;
  joinedAt: string;
}

export function useLiveVisitors() {
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channel = supabase.channel("live-visitors", {
      config: {
        presence: {
          key: `visitor_${Date.now()}`,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const visitors: LiveVisitor[] = [];
        
        Object.values(state).forEach((presences: any[]) => {
          presences.forEach((presence) => {
            visitors.push({
              visitorId: presence.visitorId,
              pagePath: presence.pagePath,
              joinedAt: presence.joinedAt,
            });
          });
        });
        
        setLiveVisitors(visitors);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("Visitor joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("Visitor left:", leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { liveVisitors, liveCount: liveVisitors.length, isConnected };
}
