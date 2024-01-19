declare namespace JSX {
    interface IntrinsicElements {
        "lottie-player": any;
    }
}
declare module "*.svg" {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}