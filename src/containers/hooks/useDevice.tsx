import { create } from "zustand";

const useDevice = create<
    {
        extension: boolean,
        mobile: boolean,
        tablet: boolean,
        site: boolean,
        setDevice: (device: string) => void
    }
>((set) => ({
    extension: false,
    mobile: false,
    tablet: false,
    site: false,
    setDevice: (device) => set((state) => ({ [device]: true }))
}));

export default useDevice;