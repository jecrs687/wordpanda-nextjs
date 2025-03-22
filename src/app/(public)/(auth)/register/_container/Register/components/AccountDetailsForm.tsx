import { ROUTES } from '@constants/ROUTES';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FormEvent, useRef } from 'react';
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
                    label="Email Address"
                    placeholder="Enter your email"
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
                    label="Password"
                    placeholder="Create a secure password"
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
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    error={errors.passwordConfirmation}
                    required
                    autoComplete="new-password"
                    defaultValue={errors.passwordConfirmation ? "" : initialValues?.get('passwordConfirmation') as string}
                />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
                <FormButton type="submit" fullWidth>
                    Continue
                </FormButton>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                        href={ROUTES.LOGIN()}
                        className="text-emerald-500 hover:text-emerald-600 font-medium transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.form>
    );
}
