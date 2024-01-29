import clsx from 'clsx'
import styles from './Button.module.scss'


export default function Button(
    {
        children,
        className,
        variety = 'primary',
        onClick,
        type = 'button',
        ...props
    }: {
        children: React.ReactNode,
        onClick?: () => void,
        className?: string,
        variety?: 'primary' | 'secondary',
        disabled?: boolean,
        type?: 'button' | 'submit',
        href?: string,

    } & React.HTMLAttributes<HTMLButtonElement>
) {
    return (
        <button className={
            clsx(styles[variety], className)
        }
            onClick={onClick}
            type={type}
            {...props}
        >
            {children}
        </button>
    )
}