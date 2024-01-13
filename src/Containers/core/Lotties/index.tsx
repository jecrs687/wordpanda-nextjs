"use client";

import LottieComponent, { LottieProps } from "react-lottie";

export const Lottie = (props: LottieProps) => {
    return (
        <LottieComponent
            options={{
                autoplay: true,
                loop: true,
                ...props.options,
            }}
            style={{ width: '320px' }}
            {...props}
        />
    );
};