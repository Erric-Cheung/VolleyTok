"use client";

import {
  getCurrentEntry,
  getNavigationState,
  pushRoute,
  saveState,
} from "@/lib/utils/navigate";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HistoryTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Handles back and forward navigation buttons in browser
    const handlePopState = (event: PopStateEvent) => {
      const locationKey = event.state?.locationKey;
      const state = getNavigationState();


      // Find key to change to location in history
      const newIndex = state.locationsHistory.findIndex(
        (entry) => entry.locationKey === locationKey
      );

      if (newIndex !== -1) {
        state.currentLocationIndex = newIndex;
        saveState(state);
      } else {
        // Fallback if key not found
        const currentPath = window.location.pathname;
        pushRoute(currentPath);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Every time the route changes
  useEffect(() => {
    console.log("NEW ROUTE HISTORY");
    const current = getCurrentEntry();
    if (!current || current.locationPathname !== pathname) {
      pushRoute(pathname);
    }
  }, [pathname]);

  return null;
};
export default HistoryTracker;
