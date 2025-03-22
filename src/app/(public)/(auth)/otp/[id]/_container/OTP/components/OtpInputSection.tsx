import OtpInput from '@common/OTP';
import Loading from 'src/app/loading';

interface OtpInputSectionProps {
    error?: string;
    onOtpSubmit: (otp: string) => void;
    isLoading: boolean;
}

export default function OtpInputSection({
    error,
    onOtpSubmit,
    isLoading
}: OtpInputSectionProps) {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="w-full">
                <OtpInput
                    onOtpSubmit={onOtpSubmit}
                    length={4}
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm animate-fadeIn">
                    {error}
                </p>
            )}

            {isLoading && (
                <div className="py-2">
                    <Loading />
                </div>
            )}
        </div>
    );
}
