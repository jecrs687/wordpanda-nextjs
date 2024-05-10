"use client";
import { useEffect, useState } from 'react';

function useWindowSize() {
    const [isMobile, setIsMobile] = useState(false)
    const [windowHeight, setWindowHeight] = useState(0)
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            if (typeof window !== 'undefined' && window.innerWidth < 840) {
                if (!isMobile) {
                    setIsMobile(true)
                    setWindowHeight(window.innerHeight)
                    setWindowWidth(window.innerWidth)
                }
            } else {
                if (isMobile) {
                    setIsMobile(false)
                    setWindowHeight(window.innerHeight)
                    setWindowWidth(window.innerWidth)
                }
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    })

    return { isMobile, windowHeight, windowWidth }
}

export default useWindowSize
