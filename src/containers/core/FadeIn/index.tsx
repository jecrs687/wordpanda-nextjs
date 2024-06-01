
import './index.scss'
export function FadeIn({ children, duration = 0.5, delay = 0, ...props }) {
    return (<div
        {...props}
        style={{
            animation: `${duration}s fadeIn ${delay}s both`,
            ...props.style
        }}>
        {children}
    </ div>
    )
}