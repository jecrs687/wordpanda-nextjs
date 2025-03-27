import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function OtpHeader() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative w-28 h-28 md:w-36 md:h-36">
                <Image
                    src="/assets/logo.png"
                    alt="WordPanda Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {t('otp.verification')}
                </h1>
                <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
                    {t('otp.codeSent')}
                </p>
            </div>
        </div>
    );
}
