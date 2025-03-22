import { useMediaQuery } from '@hooks/useMediaQuery';

type RegistrationHeaderProps = {
    step: number;
    totalSteps: number;
};

export function RegistrationHeader({ step, totalSteps }: RegistrationHeaderProps) {
    const isMobile = useMediaQuery('(max-width: 640px)');

    const getStepTitle = () => {
        switch (step) {
            case 1:
                return "Create Your Account";
            case 2:
                return "Personal Details";
            case 3:
                return "Profile Setup";
            case 4:
                return "Learning Preferences";
            case 5:
                return "Registration Complete";
            default:
                return "Join WordPanda";
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1:
                return "Start your language learning journey with WordPanda";
            case 2:
                return "Tell us a bit about yourself";
            case 3:
                return "Set up your WordPanda profile";
            case 4:
                return "Customize your learning experience";
            case 5:
                return "You're all set to start learning!";
            default:
                return "Complete the steps below to create your account";
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
