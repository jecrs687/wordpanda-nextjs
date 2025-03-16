import styles from './index.module.scss';

// Default export
function LoaderSpinner({
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

export default LoaderSpinner;

// Named export for convenience
export { LoaderSpinner };
