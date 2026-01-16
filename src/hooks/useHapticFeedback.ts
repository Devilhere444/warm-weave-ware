/**
 * Hook for haptic feedback on supported devices
 * Uses the Vibration API for Android and attempts to use webkit for iOS
 */

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

const vibrationPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [25, 50, 25],
  error: [50, 100, 50],
  selection: 5,
};

export function useHapticFeedback() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = (type: HapticType = 'light') => {
    if (!isSupported) return;

    try {
      const pattern = vibrationPatterns[type];
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not allowed
      console.debug('Haptic feedback not available:', error);
    }
  };

  const triggerLight = () => trigger('light');
  const triggerMedium = () => trigger('medium');
  const triggerHeavy = () => trigger('heavy');
  const triggerSuccess = () => trigger('success');
  const triggerWarning = () => trigger('warning');
  const triggerError = () => trigger('error');
  const triggerSelection = () => trigger('selection');

  return {
    isSupported,
    trigger,
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerWarning,
    triggerError,
    triggerSelection,
  };
}

// Standalone function for use outside of React components
export function hapticFeedback(type: HapticType = 'light') {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;

  try {
    const pattern = vibrationPatterns[type];
    navigator.vibrate(pattern);
  } catch (error) {
    console.debug('Haptic feedback not available:', error);
  }
}
