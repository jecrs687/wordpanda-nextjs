import { useMediaQuery } from '@hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';

type RegistrationHeaderProps = {
    step: number;
    totalSteps: number;
};

export function RegistrationHeader({ step, totalSteps }: RegistrationHeaderProps) {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const { t } = useTranslation();

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return t('register.steps.account.title');
            case 2:
                return t('register.steps.personal.title');
            case 3:
                return t('register.steps.profile.title');
            case 4:
                return t('register.steps.preferences.title');
            case 5:
                return t('register.steps.complete.title');
            default:
                return t('register.title');
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1:
                return t('register.steps.account.description');
            case 2:
                return t('register.steps.personal.description');
            case 3:
                return t('register.steps.profile.description');
            case 4:
                return t('register.steps.preferences.description');
            case 5:
                return t('register.steps.complete.description');
            default:
                return t('register.description');
        }
    };

    return (
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {getStepTitle()}
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                {getStepDescription()}
            </p>

            {/* Simple divider */}
            <div className="h-0.5 w-16 bg-emerald-500 mx-auto mt-4" />
        </div>
    );
}
