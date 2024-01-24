import { create } from "zustand";

const useModal = create((set) => ({
    modal: false,
    toggle: (modal) => set((state) => ({ modal: modal })),
}));

export default useModal;