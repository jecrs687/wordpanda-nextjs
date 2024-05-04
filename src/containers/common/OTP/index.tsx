import { useEffect, useRef, useState } from "react";
import styles from "./OTP.module.scss";
type OtpInputProps = {
    length?: number;
    onOtpSubmit?: (otp: string) => void;
};
const OtpInput = ({ length = 4,
    onOtpSubmit}:OtpInputProps):React.ReactElement => {
    const [otp, setOtp] = useState<Array<string>>(
        new Array(length).fill(""));
    const inputRefs = useRef([]);
 
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);
 
    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;
 
        const newOtp = [...otp];
        // allow only one input
        newOtp[index] =
            value.substring(value.length - 1);
        setOtp(newOtp);
 
        // submit trigger
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length)
            onOtpSubmit(combinedOtp);
 
        // Move to next input if current field is filled
        if (value && index < length - 1 &&
            inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };
 
    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);
 
        // optional
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    };
 
    const handleKeyDown = (index, e) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0 &&
            inputRefs.current[index - 1]
        ) {
            inputRefs.current[index - 1].focus();
        }
    };
 
    return   <div className={styles.otp}>
    {otp.map((value, index) => {
        return (
            <input
                
                key={index}
                type="text"
                ref={(input) => (inputRefs.current[index] = input)}
                value={value}
                onChange={(e) => handleChange(index, e)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.otp__input}
            />
        );
    })}
</div>;
    
};
export default OtpInput;