import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useCallback, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
}

export default function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const haptic = useHapticFeedback();
  const hasTriggeredHaptic = useRef(false);

  const handleRefresh = useCallback(async () => {
    haptic.triggerMedium();
    
    if (onRefresh) {
      await onRefresh();
    } else {
      // Default behavior: reload current data
      window.location.reload();
    }
  }, [onRefresh, haptic]);

  const { isPulling, isRefreshing, pullDistance, progress } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5,
  });

  // Haptic feedback when threshold is reached
  useEffect(() => {
    if (progress >= 1 && !hasTriggeredHaptic.current) {
      haptic.triggerLight();
      hasTriggeredHaptic.current = true;
    } else if (progress < 1) {
      hasTriggeredHaptic.current = false;
    }
  }, [progress, haptic]);

  return (
    <div className="relative">
      {/* Pull indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && pullDistance > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none safe-area-top"
            style={{ paddingTop: Math.max(pullDistance - 20, 0) }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
                isRefreshing 
                  ? 'bg-primary' 
                  : progress >= 1 
                    ? 'bg-primary' 
                    : 'bg-white/95 backdrop-blur-md'
              }`}
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              }}
            >
              <motion.div
                animate={{ 
                  rotate: isRefreshing ? 360 : progress * 180,
                }}
                transition={isRefreshing ? { 
                  repeat: Infinity, 
                  duration: 0.6,
                  ease: 'linear'
                } : { 
                  duration: 0.1 
                }}
              >
                <RefreshCw 
                  className={`w-5 h-5 transition-colors duration-100 ${
                    isRefreshing || progress >= 1 
                      ? 'text-white' 
                      : 'text-primary'
                  }`}
                  style={{
                    opacity: Math.max(0.4, progress),
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content with pull effect */}
      <motion.div
        animate={{
          y: isPulling || isRefreshing ? Math.min(pullDistance * 0.3, 30) : 0,
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 30,
          mass: 0.5
        }}
      >
        {children}
      </motion.div>

      {/* Overlay when refreshing */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-background/20 backdrop-blur-[1px] z-[99] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
