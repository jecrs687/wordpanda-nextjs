'use client'
import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import styles from './TextSearch.module.scss'

function TextSearch({
    label,
    placeholder,
    type = 'text',
    title,
    name,
    error,
    value,
    textarea = false,
    onChange,
    color = 'white',
    className,
    onFocus,
    onBlur,
    disabled,
    iconRight,
    ...rest
}: {
    label?: string,
    placeholder?: string,
    type?: string,
    name: string,
    error?: string,
    value?: string,
    textarea?: boolean,
    onChange?: (e: any) => void,
    color?: 'white' | 'black',
    className?: string,
    onFocus?: (e: any) => void,
    onBlur?: (e: any) => void,
    title: string,
    disabled?: boolean,
    iconRight?: string,
    [x: string]: any
}) {
    const [hide, setHide] = useState(true)
    const toggleHide = () => setHide(!hide)
    const typePassword = hide ? 'password' : 'text'
    const inputProps = {
        type: type === 'password' ? typePassword : type,
        name,
        id: name,
        value,
        onChange,
        placeholder,
        className: clsx(styles.input, className),
        onFocus,
        disabled,
        onBlur,
        ...rest?.field,
    }
    return (
        <>
            <div className={clsx(styles.container, styles[color])}>
                <label htmlFor={name}>{label || title || name}</label>
                {textarea ? <textarea {...inputProps} /> : <input {...inputProps} />}
                {type === 'password' && (
                    <div className={styles.icon} onClick={toggleHide}>
                        <Image
                            src={`/assets/icons/${hide ? 'eye' : 'closed_eye'}.svg`}
                            alt="Picture of the author"
                            priority={true}
                            width={20}
                            height={20}
                        />
                    </div>
                )}
                {iconRight && (
                    <div className={styles.icon}>
                        <Image
                            src={iconRight}
                            alt="icon right"
                            priority={true}
                            width={20}
                            height={20}
                        />
                    </div>
                )}
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </>
    )
}


export default TextSearch;
