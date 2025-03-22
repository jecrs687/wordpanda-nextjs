import Button from '@core/Button';
import LoaderSpinner from '@core/LoaderSpinner';

interface OtpActionsProps {
    isSubmitting: boolean;
    cooldownTime: number;
    onResendOtp: () => void;
}

export default function OtpActions({
    isSubmitting,
    cooldownTime,
    onResendOtp
}: OtpActionsProps) {
    return (
        <div className="flex flex-col space-y-4 w-full">
            <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-all duration-200 flex items-center justify-center"
            >
                {isSubmitting ? (
                    <LoaderSpinner size="large" />
                ) : (
                    "Confirmar"
                )}
            </Button>

            <Button
                disabled={cooldownTime !== 0 || isSubmitting}
                type="button"
                onClick={onResendOtp}
                className="w-full py-3 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {cooldownTime === 0
                    ? "Reenviar código"
                    : `Reenviar código em ${cooldownTime}s`
                }
            </Button>
        </div>
    );
}
