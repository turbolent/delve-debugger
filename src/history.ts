import { Parse } from "./types";

interface SavedState {
  question?: string;
  parse?: Parse;
}

export function encodeSavedState(question: string) {
  const savedState: SavedState = { question: question.trim() };
  return "#" + btoa(JSON.stringify(savedState));
}

export function getSavedState(): SavedState {
  const hash = window.location.hash;
  if (!hash.length) {
    return {};
  }

  try {
    return JSON.parse(atob(hash.substring(1)));
  } catch (_) {
    return {};
  }
}
