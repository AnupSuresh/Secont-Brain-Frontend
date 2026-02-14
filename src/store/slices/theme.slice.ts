import type { StateCreator } from "zustand";

type ThemeState = {
   theme: "dark" | "light";
};

type ThemeActions = {
   applyTheme: (t: "dark" | "light") => void;
   initTheme: () => void;
   toggleTheme: () => void;
};

export type ThemeSlice = ThemeState & ThemeActions;

export const CreateThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (
   set,
   get
) => {
   const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
   const systemPref = window.matchMedia("(prefers-color-scheme:dark)").matches
      ? "dark"
      : "light";
   const root = document.documentElement;
   return {
      theme: savedTheme ?? systemPref,

      applyTheme: (t: "dark" | "light") => {
         root.classList.toggle("dark", t === "dark");
         set({ theme: t });
         localStorage.setItem("theme", t);
      },

      initTheme: () => {
         get().applyTheme(get().theme);
      },

      toggleTheme: () => {
         const nextTheme = get().theme === "dark" ? "light" : "dark";
         get().applyTheme(nextTheme);
      },
   };
};
