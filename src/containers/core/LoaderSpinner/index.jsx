import styles from './index.module.scss'
export default function LoaderSpinner({
    size = '48px'
}) {
    return (
        <div
            style={{ width: size, height: size }}
        >
            <span
                className={styles.loader}
            />
        </div>
    )
}