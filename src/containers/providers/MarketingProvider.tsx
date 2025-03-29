"use client";

import { setCookie } from "@/src/utils/cookie";
import { useEffect } from "react";

export default function MarketingProvider() {
    useEffect(() => {
        // Capture UTM parameters
        const queryParams = new URLSearchParams(window.location.search);
        const marketingSource = queryParams.get('utm_source');
        const marketingMedium = queryParams.get('utm_medium');
        const marketingCampaign = queryParams.get('utm_campaign');
        const marketingContent = queryParams.get('utm_content');
        const marketingTerm = queryParams.get('utm_term');
        const marketingGclid = queryParams.get('gclid');
        const marketingFbclid = queryParams.get('fbclid');

        // Store UTM parameters
        setCookie('marketingSource', marketingSource || '', 30);
        setCookie('marketingMedium', marketingMedium || '', 30);
        setCookie('marketingCampaign', marketingCampaign || '', 30);
        setCookie('marketingContent', marketingContent || '', 30);
        setCookie('marketingTerm', marketingTerm || '', 30);
        setCookie('marketingGclid', marketingGclid || '', 30);
        setCookie('marketingFbclid', marketingFbclid || '', 30);

        // Capture device information
        const device = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
        setCookie('device', device, 30);

        // Capture browser information
        const browser = detectBrowser();
        setCookie('browser', browser, 30);

        // Capture operating system
        const os = detectOperatingSystem();
        setCookie('operatingSystem', os, 30);

        // Capture referrer info (first touch point)
        const referrer = document.referrer || '';
        setCookie('referrer', referrer, 30);

        // Capture landing page
        const landingPage = window.location.pathname + window.location.search;
        setCookie('landingPage', landingPage, 30);

        // Store first touch timestamp
        if (!document.cookie.includes('firstTouchTimestamp')) {
            setCookie('firstTouchTimestamp', Date.now().toString(), 30);
        }

        // Store current touch as last touch point
        setCookie('lastTouchTimestamp', Date.now().toString(), 30);
        setCookie('lastTouchPoint', landingPage, 30);

        // Capture any referral code if present
        const referralCode = queryParams.get('ref') || queryParams.get('referral');
        if (referralCode) {
            setCookie('referralCode', referralCode, 30);
        }
    }, []);

    return null;
}

// Helper functions to detect browser and OS
function detectBrowser(): string {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("SamsungBrowser") > -1) return "Samsung Browser";
    if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
    if (userAgent.indexOf("Trident") > -1) return "Internet Explorer";
    if (userAgent.indexOf("Edge") > -1) return "Edge";
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";

    return "Unknown";
}

function detectOperatingSystem(): string {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Win") > -1) return "Windows";
    if (userAgent.indexOf("Mac") > -1) return "MacOS";
    if (userAgent.indexOf("Linux") > -1) return "Linux";
    if (userAgent.indexOf("Android") > -1) return "Android";
    if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) return "iOS";

    return "Unknown";
}