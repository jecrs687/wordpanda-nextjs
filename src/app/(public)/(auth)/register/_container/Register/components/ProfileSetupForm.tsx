import { motion } from 'framer-motion';
import { FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';
import { LanguageSelector } from './LanguageSelector';

type ProfileSetupFormProps = {
    onSubmit: (data: FormData, goToNextStep?: boolean) => void;
    onBack: () => void;
    errors?: Record<string, string>;
    initialValues?: FormData;
};

export function ProfileSetupForm({
    onSubmit,
    onBack,
    errors = {},
    initialValues,
}: ProfileSetupFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const { t } = useTranslation();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            onSubmit(formData);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <FormInput
                    name="username"
                    type="text"
                    label={t('register.form.username.label')}
                    placeholder={t('register.form.username.placeholder')}
                    error={errors.username}
                    required
                    defaultValue={initialValues?.get('username') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormInput
                    name="phone"
                    type="tel"
                    label={t('register.form.phone.label')}
                    placeholder={t('register.form.phone.placeholder')}
                    error={errors.phone}
                    defaultValue={initialValues?.get('phone') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <div className="mb-4">
                    <label
                        htmlFor="languageId"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {t('register.form.nativeLanguage.label')} <span className="text-rose-500">*</span>
                    </label>
                    <LanguageSelector
                        name="languageId"
                        error={errors.languageId}
                        initialValue={initialValues?.get('languageId') as string}
                    />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 pt-4">
                <FormButton
                    variant="outline"
                    onClick={onBack}
                >
                    {t('register.form.buttons.back')}
                </FormButton>

                <FormButton
                    type="submit"
                    fullWidth
                >
                    {t('register.form.buttons.continue')}
                </FormButton>
            </motion.div>
        </motion.form>
    );
}
