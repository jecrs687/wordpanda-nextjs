"use client";

import { useEffect } from "react";

export const Lottie = ({ src, ...props }) => {
    useEffect(() => {
        import("@lottiefiles/lottie-player");
    });
    return (
        <lottie-player
            autoplay
            loop
            mode="normal"
            src={src}
            style={{ width: '320px' }}
            {...props}
        />
    );
};