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
    const ref = useRef<SVGSVGElement>(undefined)

    const importSvg = useCallback(() => {

        const { default: svgFile } = require("../../../../public" + svg)
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(svgFile, "text/xml");
        const svgComp = xmlDoc.children[0]
        ref.current.innerHTML = svgComp.innerHTML
        const attributes = ["fill", "viewBox", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "style"]

        attributes.forEach((attribute) => {
            if (ref.current.getAttribute(attribute)) return
            ref.current.setAttribute(attribute, svgComp.getAttribute(attribute) || "")
        })

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