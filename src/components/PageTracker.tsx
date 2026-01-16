import { usePageTracking } from "@/hooks/usePageTracking";
import { useVisitorPresence } from "@/hooks/useVisitorPresence";

export function PageTracker() {
  usePageTracking();
  useVisitorPresence();
  return null;
}
