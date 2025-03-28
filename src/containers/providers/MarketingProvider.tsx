"use client";

import { setCookie } from "@/src/utils/cookie";
import { useEffect } from "react";




export default function MarketingProvider() {

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const marketingSource = queryParams.get('utm_source');
        const marketingMedium = queryParams.get('utm_medium');
        const marketingCampaign = queryParams.get('utm_campaign');
        const marketingContent = queryParams.get('utm_content');
        const marketingTerm = queryParams.get('utm_term');
        const marketingGclid = queryParams.get('gclid');
        const marketingFbclid = queryParams.get('fbclid');
        setCookie('marketingSource', marketingSource || '', 30);
        setCookie('marketingMedium', marketingMedium || '', 30);
        setCookie('marketingCampaign', marketingCampaign || '', 30);
        setCookie('marketingContent', marketingContent || '', 30);
        setCookie('marketingTerm', marketingTerm || '', 30);
        setCookie('marketingGclid', marketingGclid || '', 30);
        setCookie('marketingFbclid', marketingFbclid || '', 30);
        const device = window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
        setCookie('device', device, 30);
    }, [])
    return null;
}