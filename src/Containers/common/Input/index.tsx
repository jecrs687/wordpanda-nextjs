

import styles from './Input.module.scss'
export function Input(
    {
        type = 'text',
        placeholder,
        name,
        value,
        onChange,
        className,
        title,
        error,
        ...props
    }: {
        type?: string,
        placeholder?: string,
        name?: string,
        value?: string,
        title?: string,
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
        className?: string,
        error?: string,
    }
): React.ReactElement {
    return (
        <div
            className={styles.container}

        >
            <label htmlFor={name}>{
                title || name
            }</label>
            <input
                placeholder={placeholder}
                name={name}
                {...props}
            />
            {error && <span className={styles.error}>
                {error}
            </span>}
        </div>
    )
}
