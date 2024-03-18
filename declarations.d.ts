declare namespace JSX {
    interface IntrinsicElements {
        "lottie-player": any;
    }
}
declare module '*.svg' {
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}