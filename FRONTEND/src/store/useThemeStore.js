import { create } from "zustand";

export const useThemeStore = create((set) => ({
  //theme: localStorage.getItem("preferred-theme") || "forest",
  theme: "forest",
  setTheme: (theme) => {
    localStorage.setItem("preferred-theme", theme);
    set({ theme })
  },
}));

//localStorage.setItem("preferred-theme", theme);