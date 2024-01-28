'use client';
import { useCallback, useEffect, useRef } from "react";




export function Svg(
    {
        svg,
        className,
        width,
        height,
        ...props }: {
            svg: string,
            width?: number,
            height?: number,
            className?: string
        }
) {
    const ref = useRef<SVGSVGElement>()

    const importSvg = useCallback(() => {

        const { default: svgFile } = require("../../../../public" + svg)
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(svgFile, "text/xml");
        const svgComp = xmlDoc.children[0]
        ref.current.innerHTML = svgComp.innerHTML
        ref.current.setAttribute('viewBox', svgComp.getAttribute('viewBox') || "0 0 24 24")
        ref.current.setAttribute('fill', svgComp.getAttribute('fill') || "none")
        ref.current.setAttribute('stroke', svgComp.getAttribute('stroke') || "")
        ref.current.setAttribute('stroke-width', svgComp.getAttribute('stroke-width') || "")
        ref.current.setAttribute('stroke-linecap', svgComp.getAttribute('stroke-linecap') || "")
        ref.current.setAttribute('stroke-linejoin', svgComp.getAttribute('stroke-linejoin') || "")
        ref.current.setAttribute('style', svgComp.getAttribute('style') || "")
        return svgFile
    }, [ref, svg])
    useEffect(() => {
        if (!ref.current) return
        importSvg()
    }, [ref, importSvg])
    return (
        <svg
            ref={ref}
            className={className}
            {...props}
            {...width && { width }}
            {...height && { height }}
        />
    )

}