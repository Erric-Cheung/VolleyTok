import { nanoid } from "nanoid";

export interface NavigationEntry {
  locationKey: string;
  locationPathname: string;
}

export interface NavigationState {
  currentLocationIndex: number;
  locationsHistory: NavigationEntry[];
}

const STORAGE_KEY = "navigationHistory";

/**
 * Get the current navigation state from sessionStorage.
 * If no state exists (e.g. on first load), initialize a default one.
 */
export function getNavigationState(): NavigationState {
  if (typeof window === "undefined")
    return {
      currentLocationIndex: 0,
      locationsHistory: [],
    };

  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw
    ? JSON.parse(raw)
    : {
        currentLocationIndex: 0,
        locationsHistory: [],
      };
}

/**
 * Save the given navigation state to sessionStorage.
 */
export function saveState(state: NavigationState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Push a new route into the custom navigation history.
 * This also trims any "forward" entries if user had gone back and then navigated.
 */
export function pushRoute(pathname: string) {
  const state = getNavigationState();
  const locationKey = nanoid(6);

  const newHistoryEntry: NavigationEntry = {
    locationKey: locationKey, // Unique ID for this navigation entry
    locationPathname: pathname,
  };

  // Insert browser-level key to track this visit
  window.history.replaceState({ locationKey }, "");

  // If we had gone "back", drop forward entries and add the new one
  const updatedHistory = [
    ...state.locationsHistory.slice(0, state.currentLocationIndex + 1),
    newHistoryEntry,
  ];

  const newState: NavigationState = {
    currentLocationIndex: updatedHistory.length - 1, // move pointer to newest entry
    locationsHistory: updatedHistory,
  };

  saveState(newState);
}

/**
 * Move back in the navigation history (if possible).
 * Returns the new active pathname or null if already at start.
 */
export function goBack(): string | null {
  const state = getNavigationState();
  if (state.currentLocationIndex > 0) {
    state.currentLocationIndex -= 1;
    saveState(state);
    return state.locationsHistory[state.currentLocationIndex].locationPathname;
  }
  return null;
}

/**
 * Move forward in the navigation history (if possible).
 * Returns the new active pathname or null if already at end.
 */
export function goForward(): string | null {
  const state = getNavigationState();
  if (state.currentLocationIndex < state.locationsHistory.length - 1) {
    state.currentLocationIndex += 1;
    saveState(state);
    return state.locationsHistory[state.currentLocationIndex].locationPathname;
  }
  return null;
}

/**
 * Get the currently active navigation entry.
 */
export function getCurrentEntry(): NavigationEntry | null {
  const state = getNavigationState();
  return state.locationsHistory[state.currentLocationIndex] || null;
}

/**
 * Clear the custom navigation history
 */
export function resetNavigation() {
  const initial: NavigationState = {
    currentLocationIndex: 0,
    locationsHistory: [],
  };
  saveState(initial);
}
