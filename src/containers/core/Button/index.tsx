import clsx from 'clsx'
import styles from './Button.module.scss'


export default function Button(
    {
        children,
        className,
        variety = 'primary',
        onClick,
        ...props
    }: {
        children: React.ReactNode,
        onClick?: () => void,
        className?: string,
        variety?: 'primary' | 'secondary',
        disabled?: boolean,
        href?: string,

    } & React.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <button className={
            clsx(styles[variety], className)
        }
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}