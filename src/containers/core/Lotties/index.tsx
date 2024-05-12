"use client";

import { ComponentProps } from "react";
import LottieComponent, { LottieProps } from "react-lottie";

export const Lottie = (props: LottieProps & { containerProps?: ComponentProps<'div'> }) => {
    return (
        <div {...props?.containerProps}>
            <LottieComponent
                options={{
                    autoplay: true,
                    loop: true,
                    ...props.options,
                }}
                style={{ width: '320px' }}
                {...props}
            />
        </div>

    );
};