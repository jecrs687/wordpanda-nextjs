import clsx from "clsx";
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

    return (
        <div
            className={
                clsx(
                    styles.side, {
                    [styles.sideOver]: isOver,
                }, className)}
            ref={drop}
            style={
                isOver ? styleOnDragOver : {}}
        />
    );
}
