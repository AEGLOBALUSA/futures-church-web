"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { EditorScope } from "@/lib/edit/auth";

type EditModeContextValue = {
  scope: EditorScope;
  /** True when there's an authed editor (regardless of mode toggle). */
  canEdit: boolean;
  /** True when edit-mode pill has been toggled on — affordances visible. */
  mode: boolean;
  setMode: (next: boolean) => void;
  /** Editor's display name (asked once, persisted to localStorage). */
  editorName: string;
  setEditorName: (name: string) => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

const NAME_STORAGE_KEY = "fc_edit_name";
const MODE_STORAGE_KEY = "fc_edit_mode";

export function EditModeProvider({
  scope,
  children,
}: {
  scope: EditorScope;
  children: React.ReactNode;
}) {
  const [mode, setModeState] = useState(false);
  const [editorName, setEditorNameState] = useState<string>("");

  // Hydrate edit-mode + name from localStorage on first mount.
  // Also: if the URL has ?review=1, auto-enable mode for an admin so
  // the coverage-dashboard deeplinks land already in review state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(MODE_STORAGE_KEY) === "1") setModeState(true);
    const stored = window.localStorage.getItem(NAME_STORAGE_KEY);
    if (stored) setEditorNameState(stored);

    // ?review=1 deeplink — only honoured for an admin scope. Strip the
    // param after activating so a refresh doesn't re-trigger when the
    // admin toggles off.
    if (scope?.kind === "admin") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("review") === "1") {
        setModeState(true);
        window.localStorage.setItem(MODE_STORAGE_KEY, "1");
        url.searchParams.delete("review");
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [scope]);

  const setMode = useCallback((next: boolean) => {
    setModeState(next);
    if (typeof window !== "undefined") {
      if (next) window.localStorage.setItem(MODE_STORAGE_KEY, "1");
      else window.localStorage.removeItem(MODE_STORAGE_KEY);
    }
  }, []);

  const setEditorName = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 80);
    setEditorNameState(trimmed);
    if (typeof window !== "undefined") {
      if (trimmed) window.localStorage.setItem(NAME_STORAGE_KEY, trimmed);
      else window.localStorage.removeItem(NAME_STORAGE_KEY);
    }
  }, []);

  const value: EditModeContextValue = {
    scope,
    canEdit: scope != null,
    mode,
    setMode,
    editorName,
    setEditorName,
  };

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

export function useEditMode(): EditModeContextValue {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    // Default no-op context when provider not present (e.g. on routes that
    // don't include the layout). Returns a non-editor scope.
    return {
      scope: null,
      canEdit: false,
      mode: false,
      setMode: () => {},
      editorName: "",
      setEditorName: () => {},
    };
  }
  return ctx;
}

/** Hook: can THIS component be edited by the current visitor? */
export function useCanEditCampus(slug: string | undefined): boolean {
  const { scope } = useEditMode();
  if (!slug || !scope) return false;
  if (scope.kind === "admin") return true;
  return scope.kind === "campus" && scope.slug === slug;
}
