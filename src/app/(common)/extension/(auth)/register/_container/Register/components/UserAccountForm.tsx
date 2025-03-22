'use client';
import { motion } from 'framer-motion';
import { FormInput } from './FormInput';

interface UserAccountFormProps {
    onSubmit: (formData: FormData, isLastStep?: boolean) => void;
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

export function UserAccountForm({ onSubmit, errors }: UserAccountFormProps) {
    const formFields = [
        { name: 'email', title: 'Email Address', type: 'email', placeholder: 'you@example.com', error: errors?.email, icon: 'envelope' },
        { name: 'username', title: 'Username', type: 'text', placeholder: 'johndoe', error: errors?.username, icon: 'user' },
        { name: 'password', title: 'Password', type: 'password', placeholder: '••••••••', error: errors?.password, description: 'Use at least 8 characters with a mix of letters, numbers & symbols', icon: 'lock' },
        { name: 'passwordConfirmation', title: 'Confirm Password', type: 'password', placeholder: '••••••••', error: errors?.passwordConfirmation, icon: 'shield-check' },
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
    };

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                    className="space-y-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {formFields.map((field, index) => (
                        <motion.div
                            key={field.name}
                            variants={itemVariants}
                            className="group"
                        >
                            <FormInput
                                name={field.name}
                                title={field.title}
                                type={field.type}
                                placeholder={field.placeholder}
                                error={field.error}
                                description={field.description}
                                icon={field.icon}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="flex items-center pt-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-400"
                        required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                        I agree to the <a href="#" className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 font-medium underline decoration-2 underline-offset-2 hover:decoration-emerald-500/70 transition-all">Terms of Service</a> and <a href="#" className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 font-medium underline decoration-2 underline-offset-2 hover:decoration-emerald-500/70 transition-all">Privacy Policy</a>
                    </label>
                </motion.div>

                <motion.button
                    type="submit"
                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Continue
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </motion.svg>
                </motion.button>
            </form>
        </motion.div>
    );
}
