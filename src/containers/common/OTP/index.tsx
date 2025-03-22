import { useEffect, useRef, useState } from "react";

type OtpInputProps = {
    length?: number;
    onOtpSubmit?: (otp: string) => void;
};

const OtpInput = ({
    length = 4,
    onOtpSubmit
}: OtpInputProps): React.ReactElement => {
    const [otp, setOtp] = useState<Array<string>>(
        new Array(length).fill(""));
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // allow only one input
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // submit trigger
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length)
            onOtpSubmit?.(combinedOtp);

        // Move to next input if current field is filled
        if (value && index < length - 1 &&
            inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index: number) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // optional
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0 &&
            inputRefs.current[index - 1]
        ) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex justify-center gap-2 md:gap-4">
            {otp.map((value, index) => {
                return (
                    <input
                        key={index}
                        type="text"
                        ref={input => {
                            if (input) inputRefs.current[index] = input;
                        }}
                        value={value}
                        onChange={(e) => handleChange(index, e)}
                        onClick={() => handleClick(index)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 md:w-16 md:h-20 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 focus:border-black dark:border-gray-600 dark:focus:border-white dark:bg-gray-700 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-gray-800"
                        maxLength={1}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                    />
                );
            })}
        </div>
    );
};

export default OtpInput;