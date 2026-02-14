import { type StateCreator } from "zustand";

type ModalType = "create" | "update" | null;
export type ModalData = {
   _id?: string;
   title?: string;
   link?: string;
   tags?: { name: string }[];
   isActive?: boolean;
   newTag?: string;
};

type ModalStates = {
   modalType: ModalType;
   modalData: ModalData | null;
};

type ModalActions = {
   setModalType: (newType: ModalType) => void;
   setModalData: (newData: ModalData | null) => void;
};

export type ModalSlice = ModalStates & ModalActions;

export const CreateModalSlice: StateCreator<ModalSlice> = (set) => ({
   modalType: null,
   modalData: {},
   setModalType: (newType) => {
      set({ modalType: newType });
   },
   setModalData: (newData) => {
      set({ modalData: newData });
   },
});
