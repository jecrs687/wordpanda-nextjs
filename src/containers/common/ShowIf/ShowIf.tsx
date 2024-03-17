


export function ShowIf({ condition, children }: { condition: boolean, children: React.ReactNode }) {
    return condition ? <>{children}</> : null;
}