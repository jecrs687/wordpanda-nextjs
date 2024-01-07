import clsx from 'clsx'
import Link from 'next/link'
import styles from './Linker.module.scss'


export default function Linker(
    {
        children,
        className,
        variety = 'primary',
        ...props
    }: {
        children: React.ReactNode,
        className?: string,
        variety?: 'primary' | 'secondary',
        disabled?: boolean,
        href: string,
    }
) {
    return (
        <Link className={
            clsx(styles[variety], className)
        }
            {...props}
        >
            {children}
        </Link>
    )
}