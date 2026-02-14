import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { CreateThemeSlice, type ThemeSlice } from "./slices/theme.slice";
import { CreateSidebarSlice, type SidebarSlice } from "./slices/sidebar.slice";
import { CreateModalSlice, type ModalSlice } from "./slices/modal.slice";

type Store = ThemeSlice & SidebarSlice & ModalSlice;

export const useStore = create<Store>()((...args) => ({
   ...CreateThemeSlice(...args),
   ...CreateSidebarSlice(...args),
   ...CreateModalSlice(...args),
}));

// Theme
export const useTheme = () => useStore((t) => t.theme);
export const useThemeActions = () =>
   useStore(
      useShallow((state) => ({
         initTheme: state.initTheme,
         toggleTheme: state.toggleTheme,
      })),
   );

// Sidebar
export const useSidebarState = () =>
   useStore(
      useShallow((s) => ({ isOpen: s.isOpen, activeItem: s.activeItem })),
   );
export const useSidebarActions = () =>
   useStore(
      useShallow((s) => ({
         toggleSidebar: s.toggle,
         setActiveItem: s.setActiveItem,
      })),
   );

// Modal
export const useModalState = () =>
   useStore(
      useShallow((m) => ({ modalType: m.modalType, modalData: m.modalData })),
   );
export const useModalActions = () =>
   useStore(
      useShallow((m) => ({
         setModalType: m.setModalType,
         setModalData: m.setModalData,
      })),
   );
