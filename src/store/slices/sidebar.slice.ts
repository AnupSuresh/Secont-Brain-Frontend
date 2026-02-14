import type { StateCreator } from "zustand";

type SidebarState = {
   isOpen: boolean;
   activeItem: "all" | "video" | "tweet" | "link";
};

type SidebarActions = {
   toggle: () => void;
   setActiveItem: (item: "all" | "video" | "tweet" | "link") => void;
};

export type SidebarSlice = SidebarState & SidebarActions;

export const CreateSidebarSlice: StateCreator<SidebarSlice> = (set) => ({
   isOpen: true,
   activeItem: "all",
   toggle: () => set((state) => ({ isOpen: !state.isOpen })),
   setActiveItem: (item: "all" | "video" | "tweet" | "link") =>
      set(() => ({ activeItem: item })),
});
