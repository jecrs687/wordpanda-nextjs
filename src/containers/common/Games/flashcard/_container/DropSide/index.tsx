import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import styles from './DropSide.module.scss';
export default function DropSide({
    onDrop,
    styleOnDragOver = {},
    className }) {
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

    return (
        <div
            className={
                clsx(
                    styles.side, {
                    [styles.sideOver]: isOver,
                }, className)}
            ref={dropRef}
            style={
                isOver ? styleOnDragOver : {}}
        />
    );
}
