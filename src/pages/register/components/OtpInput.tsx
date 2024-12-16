import { useEffect, useRef, useState } from "react"
import clsx from "clsx"

import style from '../styles/register.module.scss'

interface objOTP {
    quantity: number,
    onComplete: (otp: string) => void
}

const OtpInput: React.FC<objOTP> = ({ quantity, onComplete }) => {
    const [otpValue, setOtpValue] = useState<string[]>(Array(quantity).fill(""));
    const ref = useRef<any>([]);

    const handleChange = (e: any, index: number) => {
        const value = e.target.value;
        if (isNaN(Number(value))) {
            return;
        }
        const copyOtp = [...otpValue];
        copyOtp[index] = value;

        setOtpValue(copyOtp);

        if (copyOtp.every(val => val !== "")) {
            onComplete(copyOtp.join(''));
        }

        if (index + 1 < otpValue.length && value !== "") {
            ref.current[index + 1].focus();
            setTimeout(() => {
                ref.current[index + 1].select();
            }, 0);
        }
    }

    const handleKeyDown = (e: any, index: number) => {
        const key = e.key;

        if (key === "Backspace") {
            const copyOtp = [...otpValue];
            if (copyOtp[index] === "") {
                if (index > 0) {
                    ref.current[index - 1].focus();
                }
            } else {
                copyOtp[index] = "";
                setOtpValue(copyOtp);
            }
            return;
        }
        if (!/^[0-9]$/.test(key)) {
            return;
        }
    }

    const handleMouseDown = (e: any) => {
        e.preventDefault();
    }

    const focusLastInput = () => {
        const copyOtp = [...otpValue];
        const lastIndex = otpValue.length - 1;
        if (copyOtp[lastIndex] === '') {
            ref.current[0].focus();
        }
        else {
            ref.current[lastIndex].focus();
        }
    };

    useEffect(() => {
        ref.current[0].focus();
    }, [])

    return (
        <div className="row d-flex justify-content-evenly mb-5" onClick={focusLastInput}>
            {otpValue.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    value={value}
                    ref={(currentInput) => (ref.current[index] = currentInput)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleChange(e, index)}
                    maxLength={1}
                    onMouseDown={(e) => handleMouseDown(e)}
                    className={clsx(style.inputNoCaret, 'col-2')}
                />
            ))}
        </div>
    )
}

export default OtpInput