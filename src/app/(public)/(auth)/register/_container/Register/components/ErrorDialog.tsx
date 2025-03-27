import { useMediaQuery } from '@hooks/useMediaQuery';
import { Dialog } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FormButton } from './FormButton';

type ErrorDialogProps = {
    open: boolean;
    onClose: () => void;
    message: string;
};

export function ErrorDialog({ open, onClose, message }: ErrorDialogProps) {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                className: 'bg-white dark:bg-gray-900 rounded-xl overflow-hidden',
                style: {
                    padding: 0,
                    margin: isMobile ? 16 : 32,
                    maxWidth: '100%'
                }
            }}
            aria-labelledby="error-dialog-title"
            aria-describedby="error-dialog-description"
        >
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="p-5 sm:p-6 max-w-sm relative overflow-hidden"
                    >
                        {/* Background decoration */}
                        <motion.div
                            className="absolute inset-0 bg-rose-50 dark:bg-rose-900/10 z-0 rounded-full blur-3xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            exit={{ opacity: 0 }}
                            style={{ transform: 'scale(0.8) translate(-10%, -10%)' }}
                        />

                        <div className="flex items-center justify-center mb-4 relative z-10">
                            <motion.div
                                className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500"
                                initial={{ scale: 0.5, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </motion.div>
                        </div>

                        <div className="relative z-10">
                            <motion.h3
                                id="error-dialog-title"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2"
                            >
                                {t('register.errors.title')}
                            </motion.h3>

                            <motion.p
                                id="error-dialog-description"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-600 dark:text-gray-300 text-center mb-6"
                            >
                                {message}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <FormButton
                                    onClick={onClose}
                                    fullWidth
                                    icon={
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    }
                                >
                                    {t('register.errors.tryAgain')}
                                </FormButton>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Dialog>
    );
}
