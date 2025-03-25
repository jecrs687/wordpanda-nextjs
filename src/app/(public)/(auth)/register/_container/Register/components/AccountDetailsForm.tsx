import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';

type AccountDetailsFormProps = {
    onSubmit: (data: FormData, goToNextStep?: boolean) => void;
    errors?: Record<string, string>;
    initialValues?: FormData;
};

export function AccountDetailsForm({
    onSubmit,
    errors = {},
    initialValues,
}: AccountDetailsFormProps) {
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
                    name="email"
                    type="email"
                    label={t('register.form.email.label')}
                    placeholder={t('register.form.email.placeholder')}
                    error={errors.email}
                    required
                    autoComplete="email"
                    defaultValue={errors.email ? "" : initialValues?.get('email') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormInput
                    name="password"
                    type="password"
                    label={t('register.form.password.label')}
                    placeholder={t('register.form.password.placeholder')}
                    error={errors.password}
                    required
                    autoComplete="new-password"
                    defaultValue={initialValues?.get('password') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormInput
                    name="passwordConfirmation"
                    type="password"
                    label={t('register.form.passwordConfirmation.label')}
                    placeholder={t('register.form.passwordConfirmation.placeholder')}
                    error={errors.passwordConfirmation}
                    required
                    autoComplete="new-password"
                    defaultValue={errors.passwordConfirmation ? "" : initialValues?.get('passwordConfirmation') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
                <FormButton type="submit" fullWidth>
                    {t('register.form.buttons.continue')}
                </FormButton>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('register.form.alreadyHaveAccount')}{' '}
                    <Link
                        href={ROUTES.LOGIN()}
                        className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
                    >
                        {t('register.form.buttons.signIn')}
                    </Link>
                </p>
            </motion.div>
        </motion.form>
    );
}
