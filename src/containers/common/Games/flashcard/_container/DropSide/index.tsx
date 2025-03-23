import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

type DropSideProps = {
    onDrop: () => void;
    styleOnDragOver?: React.CSSProperties;
    className?: string;
    type?: 'correct' | 'incorrect';
};

export default function DropSide({
    onDrop,
    styleOnDragOver = {},
    className = '',
    type = 'correct'
}: DropSideProps) {
    const [
        { isOver },
        drop
    ] = useDrop(
        () => ({
            accept: 'card',
            drop: onDrop,
            collect: monitor => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [onDrop],
    );

    const dropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dropRef.current) {
            drop(dropRef.current);
        }
    }, [drop]);

    // Styles for correct and incorrect drop zones
    const baseClasses = "rounded-xl border-2 backdrop-blur-md transition-all duration-200 flex items-center justify-center flex-1 h-full";

    const getDropZoneClasses = () => {
        if (type === 'correct') {
            return isOver
                ? "bg-emerald-100/80 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-600"
                : "bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 border-dashed";
        } else {
            return isOver
                ? "bg-rose-100/80 dark:bg-rose-900/40 border-rose-400 dark:border-rose-600"
                : "bg-rose-50/50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 border-dashed";
        }
    };

    const Icon = type === 'correct' ? Check : X;
    const iconColor = type === 'correct'
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-rose-500 dark:text-rose-400";

    return (
        <div
            className={`${baseClasses} ${getDropZoneClasses()} ${className}`}
            ref={dropRef}
            style={isOver ? styleOnDragOver : {}}
        >
            <motion.div
                animate={isOver ? { scale: 1.2 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <Icon className={`w-6 h-6 ${iconColor} ${isOver ? 'opacity-100' : 'opacity-60'}`} />
                <span className="sr-only">{type === 'correct' ? 'Correct' : 'Incorrect'}</span>
            </motion.div>
        </div>
    );
}
