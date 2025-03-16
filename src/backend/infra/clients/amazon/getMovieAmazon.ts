export const getAmazonMovie = async (movieId, cookie) => {
    const queries = {
        "asin": movieId,
        "audioTrackId": "all",
        "clientId": "f22dbddb-ef2c-48c5-8876-bed0d47594fd",
        "consumptionType": "Streaming",
        "daiLiveManifestType": "patternTemplate,accumulating,live",
        "daiSupportsEmbeddedTrickplay": "true",
        "desiredResources": "PlaybackUrls,CuepointPlaylist,SubtitleUrls,ForcedNarratives,TrickplayUrls,TransitionTimecodes,PlaybackSettings,CatalogMetadata,XRayMetadata",
        "deviceAdInsertionTypeOverride": "SSAI",
        "deviceApplicationName": "Chrome",
        "deviceBitrateAdaptationsOverride": "CVBR,CBR",
        "deviceDrmOverride": "CENC",
        "deviceHdrFormatsOverride": "None",
        "deviceID": "8c74caf4-40cc-4f6e-b982-31fd5b929e30",
        "deviceProtocolOverride": "Https",
        "deviceStreamingTechnologyOverride": "DASH",
        "deviceTypeID": "AOAGZA014O5RE",
        "deviceVideoCodecOverride": "H264",
        "deviceVideoQualityOverride": "HD",
        "displayHeight": "2234",
        "displayWidth": "3456",
        "firmware": "1",
        "gascEnabled": "true",
        "gdprConsentAvl": "null",
        "gdprConsentGvl": "null",
        "gdprEnabled": "false",
        "languageFeature": "MLFv2",
        "liveManifestType": "patternTemplate,accumulating,live",
        "marketplaceID": "ART4WZ8MWBX2Y",
        "operatingSystemName": "Mac OS X",
        "operatingSystemVersion": "10.15.7",
        "playbackSettingsFormatVersion": "1.0.0",
        "playerAttributes": "{\"middlewareName\":\"Chrome\",\"middlewareVersion\":\"126.0.0.0\",\"nativeApplicationName\":\"Chrome\",\"nativeApplicationVersion\":\"126.0.0.0\",\"supportedAudioCodecs\":\"AAC\",\"frameRate\":\"SFR\",\"H264.codecLevel\":\"3.1\",\"H265.codecLevel\":\"0.0\",\"AV1.codecLevel\":\"0.0\"}",
        "playerType": "xp",
        "resourceUsage": "CacheResources",
        "sitePageUrl": "https://www.primevideo.com/region/na/detail/0I1825R804LPEPARLATI6JSXF3/ref=atv_mv_hom_c_OBc6843a_brws_32_1?jic=8%7CEgRzdm9k",
        "ssaiSegmentInfoSupport": "Base",
        "ssaiStitchType": "MultiPeriod",
        "subtitleFormat": "TTMLv2",
        "supportedDRMKeyScheme": "DUAL_KEY",
        "supportsEmbeddedTimedTextForVod": "false",
        "supportsEmbeddedTrickplay": "true",
        "supportsEmbeddedTrickplayForVod": "false",
        "supportsVariableAspectRatio": "true",
        "titleDecorationScheme": "primary-content",
        "userWatchSessionId": "0aff547f-61b8-414a-b28b-905e3cc0c89e",
        "uxLocale": "pt_BR",
        "videoMaterialType": "Feature",
        "vodStreamSupportOverride": "Auxiliary",
        "xrayDeviceClass": "normal",
        "xrayPlaybackMode": "playback",
        "xrayToken": "XRAY_WEB_2023_V2"
    }
    const queriesConverted = Object.keys(queries).map(key => key + '=' + queries[key]).join('&');

    const capture = await fetch("https://atv-ps.primevideo.com/cdp/catalog/GetPlaybackResources?" + queriesConverted, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en,pt-BR;q=0.9,pt;q=0.8,it;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            cookie,
            "Referer": "https://www.primevideo.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "POST"
    })
    return await capture.json() as AmazonMovie;
};

export interface AmazonMovie {
    catalogMetadata: CatalogMetadata;
    errorsByResource: ErrorsByResource;
    playbackSettings: PlaybackSettings;
    returnedTitleRendition: ReturnedTitleRendition;
    transitionTimecodes: TransitionTimecodes;
}

export interface CatalogMetadata {
    catalog: Catalog;
    family: Family;
    images: Images;
    playback: Playback;
    version: string;
}

export interface Catalog {
    entityType: string;
    id: string;
    regulatoryRating: string;
    runtimeSeconds: number;
    synopsis: string;
    title: string;
    type: string;
    version: string;
}

export interface Family {
    version: string;
}

export interface Images {
    imageUrls: ImageUrls;
    version: string;
}

export interface ImageUrls {
    episode: string;
    hero: string;
    title: string;
}

export interface Playback {
    accessControls: AccessControls;
    audioTracks: AudioTrack[];
    summary: Summary;
    version: string;
}

export interface AccessControls {
    pinLength: number;
    restrictions: any[];
}

export interface AudioTrack {
    displayName: string;
    id: string;
    isOriginalLanguage: boolean;
    language: string;
    type: string;
}

export interface Summary {
    isPlayable: boolean;
}

export interface ErrorsByResource {
    CuepointPlaylist: CuepointPlaylist;
    ForcedNarratives: CuepointPlaylist;
    PlaybackUrls: CuepointPlaylist;
    SubtitleUrls: CuepointPlaylist;
    TrickplayUrls: CuepointPlaylist;
    XRayMetadata: CuepointPlaylist;
}

export interface CuepointPlaylist {
    errorCode: string;
    message: string;
    type: string;
}

export interface PlaybackSettings {
    caching: Caching;
    callback: Callback;
    formatVersion: string;
    playbackSettings: string;
    settingsId: string;
}

export interface Caching {
    timeToLiveMillis: number;
}

export interface Callback {
    delayMillis: number;
    url: string;
}

export interface ReturnedTitleRendition {
    asin: string;
    assetBundleVideoQuality: string;
    audioQuality: string;
    audioTrackId: string;
    contentId: string;
    selectedEntitlement: SelectedEntitlement;
    titleId: string;
    videoMaterialType: string;
    videoQuality: string;
    videoResolution: string;
}

export interface SelectedEntitlement {
    rightsException: CuepointPlaylist;
}

export interface TransitionTimecodes {
    autoPlayTimer: number;
    endCreditsStart: number;
    outroCreditsStart: number;
}
