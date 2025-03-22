"use client";
import { motion } from "framer-motion";
import { components, MenuListProps } from "react-select";

export const LanguageMenuList = (props: MenuListProps<any>) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <components.MenuList {...props}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="py-1 space-y-1"
            >
                {props.children}
            </motion.div>
        </components.MenuList>
    );
};
