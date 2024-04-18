export interface ISubtitlePrime {
    provider: string;
    responseBody: ResponseBody;
}

export interface ResponseBody {
    catalogMetadata: CatalogMetadata;
    cuepointPlaylist: CuepointPlaylist;
    forcedNarratives: ForcedNarrative[];
    playbackSettings: PlaybackSettings;
    playbackUrls: PlaybackUrls;
    returnedTitleRendition: ReturnedTitleRendition;
    subtitleUrls: ForcedNarrative[];
    transitionTimecodes: TransitionTimecodes;
    trickplayUrls: TrickplayUrls;
    xrayMetadata: XrayMetadata;
}

export interface CatalogMetadata {
    catalog: CatalogMetadataCatalog;
    family: Family;
    images: Images;
    playback: Playback;
    version: string;
}

export interface CatalogMetadataCatalog {
    entityType: string;
    episodeNumber: number;
    id: string;
    regulatoryRating: string;
    runtimeSeconds: number;
    synopsis: string;
    title: string;
    type: string;
    version: string;
}

export interface Family {
    tvAncestors: TvAncestor[];
    version: string;
}

export interface TvAncestor {
    catalog: TvAncestorCatalog;
    version: string;
}

export interface TvAncestorCatalog {
    id: string;
    seasonNumber?: number;
    title: string;
    type: string;
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
    audioTracks: PlaybackAudioTrack[];
    summary: Summary;
    version: string;
}

export interface AccessControls {
    pinLength: number;
    restrictions: any[];
}

export interface PlaybackAudioTrack {
    displayName: string;
    id: string;
    isOriginalLanguage: boolean;
    language: string;
    type: string;
}

export enum SubtypeEnum {
    Descriptive = "descriptive",
    Dialog = "dialog",
    Unknown = "Unknown",
}

export interface Summary {
    isPlayable: boolean;
}

export interface CuepointPlaylist {
    additionalMetadata: AdditionalMetadata;
    cuepointFulfillmentMetadata: CuepointFulfillmentMetadata;
    encodedManifest: string;
    format: string;
}

export interface AdditionalMetadata {
    showCountdownTimer: boolean;
}

export interface CuepointFulfillmentMetadata {
    cuepointFulfillmentAssetList: CuepointFulfillmentAssetList[];
}

export interface CuepointFulfillmentAssetList {
    cardType: string;
    contentId: string;
    duration: number;
    playhead: number;
}

export interface ForcedNarrative {
    displayName: string;
    format: string;
    index: string;
    languageCode: string;
    subtype: string;
    timedTextTrackId: string;
    trackGroupId: string;
    type: string;
    url: string;
    videoMaterialType: string;
}

export enum Format {
    TTMLv2 = "TTMLv2",
}

export enum PurpleType {
    Narrative = "narrative",
    SDH = "sdh",
    Subtitle = "subtitle",
}

export enum VideoMaterialType {
    Feature = "Feature",
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

export interface PlaybackUrls {
    audioTracks: PlaybackUrlsAudioTrack[];
    auxCacheKey: string;
    cacheKey: string;
    defaultAudioTrackId: string;
    defaultUrlSetId: string;
    urlSets: { [key: string]: any };
}

export interface PlaybackUrlsAudioTrack {
    audioSubtype: string;
    audioTrackId: string;
    displayName: string;
    index: string;
    languageCode: string;
    trackGroupId: string;
}


export interface The1982916431E9730Cc453FB48E46C7Aeff75E71_Class {
    failover: The1982916431E9730Cc453FB48E46C7Aeff75E71_Failover;
    urlSetId: string;
    urls: Urls;
}

export interface The1982916431E9730Cc453FB48E46C7Aeff75E71_Failover {
    default: Default;
}

export interface Default {
    mode: Mode;
    urlSetId: string;
}

export enum Mode {
    Seamless = "seamless",
}

export interface Urls {
    manifest: Manifest;
}

export interface Manifest {
    audioFormat: string;
    audioTrackId: string;
    bitrateAdaption: string;
    cdn: string;
    cdnOrigin: string;
    compressionStandard: string;
    contiguityType: string;
    drm: string;
    duration: number;
    dynamicRange: string;
    encodingVersion: string;
    fragmentRepresentation: string;
    frameRate: string;
    isFmmCompatible: boolean;
    origin: string;
    streamingTechnology: string;
    subtitleRepresentation: string;
    url: string;
    videoQuality: string;
}

export interface The1982916431E9730Cc453FB48E46C7Aeff75E72_Class {
    failover: The1982916431E9730Cc453FB48E46C7Aeff75E72_Failover;
    urlSetId: string;
    urls: Urls;
}

export interface The1982916431E9730Cc453FB48E46C7Aeff75E72_Failover {
    cdn: Default;
    default: Default;
}

export interface ReturnedTitleRendition {
    asin: string;
    assetBundleVideoQuality: string;
    audioQuality: string;
    audioTrackId: string;
    contentId: string;
    pid: string;
    selectedEntitlement: SelectedEntitlement;
    titleId: string;
    videoMaterialType: string;
    videoQuality: string;
    videoResolution: string;
}

export interface SelectedEntitlement {
    benefit: string;
    consumptionExpiration: string;
    entitlementType: string;
    grantedByCustomerId: string;
}

export interface TransitionTimecodes {
    autoPlayTimer: number;
    endCreditsStart: number;
    outroCreditsStart: number;
    skipElements: SkipElement[];
}

export interface SkipElement {
    buttonShowtimeMs: number;
    elementType: string;
    endTimecodeMs: number;
    startTimecodeMs: number;
}

export interface TrickplayUrls {
    trickplayUrlsCdnSets: TrickplayUrlsCDNSet[];
}

export interface TrickplayUrlsCDNSet {
    cdn: string;
    cdnWeightsRank: string;
    trickplayUrlInfoList: TrickplayURLInfoList[];
}

export interface TrickplayURLInfoList {
    resolution: string;
    url: string;
}

export interface XrayMetadata {
    initialPageLoadAction: InitialPageLoadAction;
    parameters: Parameters;
    version: string;
}

export interface InitialPageLoadAction {
    api: string;
    linkType: string;
    parameters: Parameters;
    type: string;
    version: number;
}

export interface Parameters {
    isUXRedesign: string;
    isXrayLiteTitle: string;
    pageId: string;
    pageType: string;
    serviceToken: string;
}
