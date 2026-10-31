import { useEffect, useCallback } from "react";

/**
 * Pushes a history state when a sheet/overlay opens so the system/Gesture
 * back button dismisses it instead of leaving the page. Returns a `dismiss`
 * function that should be used in place of `onClose` for in-app close actions
 * (X button, backdrop tap) so the pushed state is popped cleanly.
 */
export function useDismissOnBack(onClose, key = "sheet") {
  const dismiss = useCallback(() => {
    if (window.history.state && window.history.state[key]) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose, key]);

  useEffect(() => {
    window.history.pushState({ [key]: true }, "");
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (window.history.state && window.history.state[key]) {
        window.history.back();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return dismiss;
}