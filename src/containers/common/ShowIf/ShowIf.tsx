


export function ShowIf({ condition, children, onlyHide }: { condition: boolean, children: React.ReactNode, onlyHide?: boolean }) {

    if (condition) return children;
    if (onlyHide) return <div style={{ display: 'none' }}>{children}</div>;
    return null;
}