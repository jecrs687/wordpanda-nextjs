import { ROUTES } from '@constants/ROUTES';
import Link from 'next/link';

export default function OtpFooter() {
    return (
        <div className="text-center pt-4">
            <Link
                href={ROUTES.LOGIN()}
                className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm transition-colors duration-200"
            >
                Tem uma conta? Faça login
            </Link>
        </div>
    );
}
