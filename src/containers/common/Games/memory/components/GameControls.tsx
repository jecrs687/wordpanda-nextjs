'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import GameButton from '../../_components/GameButton';

type GameControlsProps = {
    onRestart: () => void;
    loading: boolean;
};

const GameControls = ({ onRestart, loading }: GameControlsProps) => {
    return (
        <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <GameButton
                onClick={onRestart}
                variant="outline"
                size="md"
                icon={loading ? <ArrowLeftRight className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Restart Game'}
            </GameButton>
        </motion.div>
    );
};

export default GameControls;
