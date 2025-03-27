import { motion } from 'framer-motion';
import { FormEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormButton } from './FormButton';
import { FormInput } from './FormInput';

type PersonalDetailsFormProps = {
    onSubmit: (data: FormData, goToNextStep?: boolean) => void;
    onBack: () => void;
    errors?: Record<string, string>;
    initialValues?: FormData;
};

export function PersonalDetailsForm({
    onSubmit,
    onBack,
    errors = {},
    initialValues,
}: PersonalDetailsFormProps) {
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
                    name="firstName"
                    type="text"
                    label={t('register.form.firstName.label')}
                    placeholder={t('register.form.firstName.placeholder')}
                    error={errors.firstName}
                    required
                    defaultValue={initialValues?.get('firstName') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <FormInput
                    name="lastName"
                    type="text"
                    label={t('register.form.lastName.label')}
                    placeholder={t('register.form.lastName.placeholder')}
                    error={errors.lastName}
                    required
                    defaultValue={initialValues?.get('lastName') as string}
                />
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
