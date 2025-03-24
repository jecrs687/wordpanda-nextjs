import { motion } from "framer-motion";
import { useFormStatus } from "react-dom";

export const Submit = () => {
    const { pending } = useFormStatus();

    return (
        <motion.button
            whileHover={{ scale: pending ? 1 : 1.01 }}
            whileTap={{ scale: pending ? 1 : 0.98 }}
            type="submit"
            disabled={pending}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${pending
                    ? 'bg-emerald-600/80 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
        >
            <motion.div
                initial={false}
                animate={{
                    y: pending ? [0, -2, 0] : 0,
                }}
                transition={{
                    repeat: pending ? Infinity : 0,
                    duration: 1.2,
                }}
                className="flex justify-center items-center"
            >
                {pending ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Entrando...</span>
                    </>
                ) : (
                    <>
                        <span>Entrar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </>
                )}
            </motion.div>
        </motion.button>
    );
};
