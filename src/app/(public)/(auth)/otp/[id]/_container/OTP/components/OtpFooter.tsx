import { ROUTES } from '@constants/ROUTES';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function OtpFooter() {
    const { t } = useTranslation();

    return (
        <div className="text-center pt-4">
            <Link
                href={ROUTES.LOGIN()}
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm transition-colors duration-200"
            >
                {t('otp.haveAccount')}
            </Link>
        </div>
    );
}
