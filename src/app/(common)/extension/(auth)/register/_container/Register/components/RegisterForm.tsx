'use client';
import { SelectLanguage } from '@common/SelectLanguage';
import { motion } from 'framer-motion';
import { FormInput } from './FormInput';

interface RegisterFormProps {
    formAction: (formData: FormData) => void;
    errors?: {
        email?: string;
        password?: string;
        passwordConfirmation?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        username?: string;
    };
}

export function RegisterForm({ formAction, errors }: RegisterFormProps) {
    const formFields = [
        { name: 'email', title: 'Email Address', type: 'email', placeholder: 'you@example.com', error: errors?.email },
        { name: 'password', title: 'Password', type: 'password', placeholder: '••••••••', error: errors?.password },
        { name: 'passwordConfirmation', title: 'Confirm Password', type: 'password', placeholder: '••••••••', error: errors?.passwordConfirmation },
        { name: 'firstName', title: 'First Name', type: 'text', placeholder: 'John', error: errors?.firstName },
        { name: 'lastName', title: 'Last Name', type: 'text', placeholder: 'Doe', error: errors?.lastName },
        { name: 'phone', title: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', error: errors?.phone },
        { name: 'username', title: 'Username', type: 'text', placeholder: 'johndoe', error: errors?.username },
    ];

    return (
        <motion.form
            action={formAction}
            className="mt-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {formFields.map((field, index) => (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.4 }}
                            className={field.name === 'email' || field.name === 'password' || field.name === 'passwordConfirmation' || field.name === 'username' ? "sm:col-span-2" : ""}
                        >
                            <FormInput
                                name={field.name}
                                title={field.title}
                                type={field.type}
                                placeholder={field.placeholder}
                                error={field.error}
                            />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Preferred Language
                    </label>
                    <SelectLanguage className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200" />
                </div>
            </div>

            <motion.button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-emerald-200 group-hover:text-emerald-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </span>
                Create Account
            </motion.button>
        </motion.form>
    );
}
