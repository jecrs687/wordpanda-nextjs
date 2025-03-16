export const getCatalogAmazon = async (cookies, {
    type,
    pageNumber,
    pageSize,
    startIndex
} = {
        type: "movie",
        pageNumber: 5,
        pageSize: 14,
        startIndex: 49
    }) => {
    const body = `pageType=${type}&pageId=home&pageNumber=${pageNumber}&pageSize=${pageSize}&startIndex=${startIndex}&serviceToken=eyJ0eXBlIjoidnBhZ2UiLCJuYXYiOmZhbHNlLCJzZWMiOiJjZW50ZXIiLCJwcmlkIjoiZTA3MGIyZmQtNDdiNS00Nzg0LTllNzEtYTNmNTM5ZWZlODNmIiwicnQiOiIiLCJmaWx0ZXIiOnt9LCJyYW5rIjoiSDRzSUFBQUFBQUFBL3pWU1NSSWpJUXo3VUE1ZXdJYmNNRXVXVG1mdG5rN3kvNGRNQldhT3FHekpFc0k5Y3A2UDlaUDk1aS96dHFQOXpSdzU0UlJqRGtnNzNDUHFScmYwS0xEYXkzWGdlYWI3SStudE1XL25IOEIrblV0NGFZV2JjT2VvRW4ySVVOQ285SlhOMGVzd1hVOGJ5TnduVEtzWnMwcWpOR1NkaUhtVkJqNzFsWGlLazM3ejZYVFBvVS80QXI2V0dCa1JPeEFxZ3pDQVo5SU94Q3dTV2NYTTdNZEJQcnpuNStXNVdIakZmdW1oVFpUMTg0ZWlZRmQ1dkErblpoR0xlZDg1bXVhY0ZUeUZPTHcwTnF3cDU1YWs3R2h2SDgyV3BCUXc1L1hIOGRLbzYrU2dhT3dpRk02WUd6SEVkTy92YjdnczEwTTRyT0JlSTU2TXlWZVhMSXZ2VjhCMTRXT1RndVc0OUFrbU1MVVNRMGt5dktiYWluY2FhWWlpdThqanMyM0x2SWF1Z3ZaWXp1OFNuOVAxOWgxNXNZbVVFaXFuMmdHUUVITUdhRmFwQXhqSkkxWkI3d2NRZ2FnVnh3MDkvMGdscmJxNCs5cjg4aDVoU0VoZUJVUndiQ1FwNkRFYlFxazk0UW9uK3VEMWZ1VnN3d29XRUdteDFEaitzVG96Y0d4S1JQL3Y4cFFoS0ZCdjNEck5ONlkycTNmSFliNFFKS1Vpek8wM2NEaG1RLys1THNlODlvUlR1bnltOUszMHh1RzlLbkxPdmdWc295c1NVblhxVXRCUkw0THo2MGJUeWhqV3k3aFRnRWxac1VBWDRjc0R0N2VMOVRqRGZWUlVpd2dYYitWZm9BSWhHcHV5Z04vOUJWRGNFUlpOQXdBQSIsIm9mZnNldCI6MCwibnBzaSI6MCwib3JlcSI6IjMwNGNiOWFiLTc0N2MtNDE0ZS1iYTEwLTFiZGU2NWQ3NGYzNDoxNzIxMzMzNDE2MDAwIiwiYXBNYXgiOjU4LCJhdXRvYm90Ijoie1wicnNpcFN0YXRlSWRcIjpcIlJTSVBkNGM1ZDE5NGJiNDllYWU5MDgzYzNhMDlhZWY3YjUyZTQ3OTRiYTIwOGNkZGUwN2ExMTU2OTJiMzVkZGEzNDYyXCJ9Iiwib3JlcWsiOiJkYlF2S0lIL1pTaG9UQXZpR0RIMWNTZlVtRnhMUWE4czdSZkJadE1DaW5NPSIsIm9yZXFrdiI6MSwiZGRwdCI6InYxOkFRY0FBQUJhQUFBQUJBQUFBQXVRQUFBUUZBQUFBQ1FRQUFFSUFJU0JBQUFBQUFBQkFBQUFBZ0NBQUFnQkFBQUFBSVFFSUFBQUFBeUNNQUFBQUFBSUVnQWdBQUFBUkFFQUdBQUNBQUFCQVFBQXdnRUFDQUFBUUFDQkFBQUFBQUFLZ0NBa1FBQWdBa0FBQUlBQUFZQ0JBbEFDQUVDQUFBQUFRQUJBQUFBb0FHUUFBQVlCUUFBQUFBSUFFZ0FBQUFHQ0FBZ0FVQWdnSUFCQUFTVUVBQkFCSUFBVUFBQUFBQUlBQUFJQUFBQUFJU0FBQWdKQUFnQUFRQWlBQUlBSUFBR0lJQUFBQVFBQWhBR0FBREVDQUlBQUFJRUFRaEFBU0JBZ0FFQUFJQUNJQWxBQUVBb0VJQUVDQUFBRUlBQUJCQW9FQUFBQUFBQUFBQUlBRUFBQkdRRFpBQUFCRUNBRWhBQWdGQ0FBQkFETkFBSUFBQVFnQUFEQUFBQUVDZ0NhQVFBQUNRQUFSQUFFQUFCQUFBUUFFSUVBRUFBQUFBQUFFQkVBQUFBUUJDQ0FBQUFBZ0lRQ0VBQUFBQUFBSUFBQUFBQVFRQ0VJQUFBQUFBQUFDQUlBR1FBQUlDQWdBQUFBQ0FBUUFJUmdBS0FBQUFNZ0FBQUFBQUFDQUFBQUlBZ0FBQUFBQVFJS0VBQkFBQUFRQUFnUUFCUUpnRUFJQUFBSUNnQ0FBQUJBY0FCQWdBUUJBQUFDaUVDUUJnQUlBQ2dBRVJBQUFCQ1FBQUFBaUFpQUFBSUFRQUFnQUJSSUFBQUVBQXhJQUlBQUFBQUNBQUFtQUFBQUFnQUFsZ0lnZ2dBQkFRQUlBQVFEQVFJQUNBUkFBQUlBQUFBQUFBcE1BSUFBQUNBRUFBQUFRQUdCQUFBQUNBQUFDRUFBQ0FBQUFBRUFBZ0lBQUlBQUFBRUFnQUFBQUFJZ0FBQ3dDQVFBQUVCZ0FCSUFFQ0FBQWdBQUZDQUFBQUlpQUJBQUJBQ0FBSUFBQUFBQWdBQUJBQUFnQUlnQUFRQTBBQUFBSVFJd1FBQkFBRUFpQkFBQUFBQUFFUUVBRUlnQUFBaUlBQUVLaUFJQVNCQUpDQUNBQUNBQUFCQWd3QUFBQUFBSWdBQUFBQUFBQVNBQUNBQk1BZ29BQWdLQUNBQUJBUWdEQUFBaEFBZ0FJRUFBQUFBQUpBZ0NGQUFBQUFCQkFBQkFJZ2dBZ0FBTUFBQUVRQUFBRmdBQWdBQXNBQUtvSUFCVUFBS2dJQUFBQkFJQXdBb0FBQUFFIiwiYXdhcmV0IjpbMCwtOTA5MjAwNTg3MTgwNDk4NTQxNywtNzM3ODA3NTY0MjY3MzY5NjQzMiw0OTA4NjcxOTA3MzQ4MjM2OTM2LC03MzU0NTIwNjM5NjIxNTY4MTQ3LDY1Mjg3NDM1MzUxNjIzNjM4NSwtNjMzMjM0ODgwOTAwODY0ODI3OCw1MDgyNDkyNjkwODc5NDMxNjQwLC02NjE5NDg5MTI0MjQ1OTA5ODM3XX0%3D&targetId=V2%3D4AEA6u69gYPeuYe-toZwYWdlSWSIcGFnZVR5cGWMY29sbGVjdGlvbklkiHdpZGdldElkjo5zd2lmdElkVmVyc2lvbt6VioRob21li4Vtb3ZpZYwPjQ-OglYy&variant=desktopOSX&actionScheme=default&payloadScheme=default&decorationScheme=web-decoration-gti-v4&featureScheme=web-features-v6&dynamicFeatures=integration&dynamicFeatures=CLIENT_DECORATION_ENABLE_DAAPI&dynamicFeatures=ENABLE_DRAPER_CONTENT&dynamicFeatures=HorizontalPagination&dynamicFeatures=CleanSlate&dynamicFeatures=EpgContainerPagination&dynamicFeatures=ENABLE_GPCI&dynamicFeatures=SupportsImageTextLinkTextInStandardHero&widgetScheme=web-explorecs-v11&isRemasterEnabled=0`
    const convertBodyToBytesContentLength = new TextEncoder().encode(body).length.toString();
    const catalog = await fetch("https://www.primevideo.com/region/na/api/getLandingPage?", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en,pt-BR;q=0.9,pt;q=0.8,it;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "device-memory": "8",
            "downlink": "9.75",
            "dpr": "2",
            "ect": "4g",
            "pragma": "no-cache",
            "priority": "u=1, i",
            "rtt": "100",
            "sec-ch-device-memory": "8",
            "sec-ch-dpr": "2",
            "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-ch-ua-platform-version": "\"14.5.0\"",
            "sec-ch-viewport-width": "563",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "viewport-width": "563",
            "x-amzn-client-ttl-seconds": "15",
            "x-amzn-requestid": "PD3QJ7V69B0D80FXRHHT",
            "x-requested-with": "XMLHttpRequest",
            cookies,
            "Referer": "https://www.primevideo.com/region/na/storefront/ref=atv_dp_mv_c_9zZ8D2_hm_mv?contentType=movie&contentId=home",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "content-length": "3650",

        },
        "method": "POST",
        body
    });

    return await catalog.json() as AmazonCatalog;
}



export interface AmazonCatalog {
    __type: string;
    containers: Container[];
    hasFailed: boolean;
    isTrailerAutoplayEnabled: boolean;
    metadata: Metadata;
    pagination: Pagination;
    playbackLaunchType: string;
    resiliencyEligibility: string;
    strings: Strings;
    swiftPageParameters: SwiftPageParameters;
}

export interface Container {
    containerType: ContainerType;
    entities: Entity[];
    entitlementCues: ContainerEntitlementCues;
    estimatedTotal: number;
    facetText?: FacetText;
    impressionData: string;
    journeyIngressContext: JourneyIngressContext;
    paginationServiceToken?: string;
    paginationStartIndex?: number;
    paginationTargetId?: string;
    seeMore?: SeeMore;
    seeMoreDescription?: string;
    seeMoreLink?: SeeMoreLinkClass;
    text: string;
    title: string;
    webUid: string;
}

export enum ContainerType {
    StandardCarousel = "StandardCarousel",
}

export interface Entity {
    buyBoxActions: any[];
    categorizedGenres: CategorizedGenres;
    contentMaturityRating: ContentMaturityRating;
    degradations: any[];
    displayTitle: string;
    entitlementCues: EntityEntitlementCues;
    entityType: EntityTypeEnum;
    hideThisAction: HideThisAction;
    hoverInfo: HoverInfo;
    images: Images;
    itemAnalytics: ItemAnalytics;
    link: CoverClass;
    maturityRatingBadge: MaturityRatingBadge;
    overflowMenu: OverflowMenu;
    playbackAction?: PlaybackAction;
    playbackActions: PlaybackAction[];
    refMarker: string;
    releaseYear: string;
    runtime: string;
    synopsis: string;
    title: string;
    titleID: string;
    watchlistAction: Action;
    widgetType: WidgetType;
    progress?: Progress;
}

export interface CategorizedGenres {
    primaryGenre: AryGenre;
    secondaryGenres?: AryGenre[];
}

export enum AryGenre {
    Animações = "Animações",
    Anime = "Anime",
    ArtesEntretenimentoECultura = "Artes, Entretenimento e Cultura",
    Arthouse = "Arthouse",
    Aventura = "Aventura",
    Ação = "Ação",
    Comédia = "Comédia",
    Documentários = "Documentários",
    Drama = "Drama",
    Epg = "EPG",
    Esportes = "Esportes",
    Fantasia = "Fantasia",
    Faroeste = "Faroeste",
    FicçãoCientífica = "Ficção científica",
    FéEEspiritualidade = "Fé e Espiritualidade",
    Histórico = "Histórico",
    Infantil = "Infantil",
    InteressesEspeciais = "Interesses Especiais",
    Internacionais = "Internacionais",
    Lgbtq = "LGBTQ",
    MilitarEGuerra = "Militar e Guerra",
    PúblicoYoungAdultJovensAdultos = "Público Young Adult (Jovens Adultos)",
    Romance = "Romance",
    Suspense = "Suspense",
    Terror = "Terror",
    VideoclipesEShows = "Videoclipes e Shows",
}

export interface ContentMaturityRating {
    locale?: Locale;
    rating: string;
    title: DescriptionEnum;
}

export enum Locale {
    Br = "br",
}

export enum DescriptionEnum {
    Adolescentes = "(adolescentes).",
    Adultos = "(adultos).",
    Al = "al",
    Crianças = "(crianças).",
    CriançasMaisVelhas = "(crianças mais velhas).",
    JovensAdultos = "(jovens adultos).",
    NãoRecomendadoParaMenoresDe10Anos = "Não recomendado para menores de 10 anos",
    NãoRecomendadoParaMenoresDe12Anos = "Não recomendado para menores de 12 anos",
    NãoRecomendadoParaMenoresDe14Anos = "Não recomendado para menores de 14 anos",
    NãoRecomendadoParaMenoresDe16Anos = "Não recomendado para menores de 16 anos",
    NãoRecomendadoParaMenoresDe18Anos = "Não recomendado para menores de 18 anos",
    PúblicoEmGeral = "Público em geral",
    SuitableForAges16AndOver = "Suitable for ages 16 and over",
    SuitableForAges18AndOver = "Suitable for ages 18 and over",
    VerifiqueAClassificaçãoIndicativa = "VERIFIQUE A CLASSIFICAÇÃO INDICATIVA",
}

export interface EntityEntitlementCues {
    buyboxMessage: BuyboxMessage;
    compactFocusMessage: BuyboxMessage;
    entitlementType: EntitlementType;
    focusMessage: Message;
    glanceMessage: Message;
    highValueMessage: Message;
    informationalMessage: BuyboxMessage;
    informationalMessages: any[];
    providerLogo: BuyboxMessage;
    titleMetadataBadge: BuyboxMessage;
}

export interface BuyboxMessage {
}

export enum EntitlementType {
    Entitled = "Entitled",
    Unentitled = "Unentitled",
}

export interface Message {
    icon?: Icon;
    message: MessageEnum;
}

export enum Icon {
    EntitledIcon = "ENTITLED_ICON",
    OfferIcon = "OFFER_ICON",
    TrendingIcon = "TRENDING_ICON",
}

export enum MessageEnum {
    Comprar = "Comprar",
    ComprarOuAlugar = "Comprar ou alugar",
    DeixaOPrimeVideoEm14Dias = "Deixa o Prime Video em 14 dias",
    DisponívelParaAlugarOuComprar = "Disponível para alugar ou comprar",
    DisponívelParaCompra = "Disponível para compra",
    Empty = "",
    IncluídoNoPrime = "Incluído no Prime",
    IndicadoAoBAFTACHILDRENSAWARD = "Indicado ao BAFTA CHILDREN'S AWARD®",
    IndicadoAoBAFTAFILMAWARD = "Indicado ao BAFTA FILM AWARD®",
    IndicadoAoGOLDENGLOBE = "Indicado ao GOLDEN GLOBE®",
    IndicadoAoOSCAR = "Indicado ao OSCAR®",
    IndicadoAoPRIMETIMEEMMY = "Indicado ao PRIMETIME EMMY®",
    The11Oscars = "11 OSCARS®",
    The1NaItália = "#1 na Itália",
    The2BaftaFilmAwards = "2 BAFTA FILM AWARDS®",
    The2GoldenGlobes = "2 GOLDEN GLOBES®",
    The2IndicaçõesAoGOLDENGLOBES = "2 indicações ao GOLDEN GLOBES®",
    The2IndicaçõesAoOSCARS = "2 indicações ao OSCARS®",
    The2Oscars = "2 OSCARS®",
    The3GoldenGlobes = "3 GOLDEN GLOBES®",
    The3IndicaçõesAoBAFTAFILMAWARDS = "3 indicações ao BAFTA FILM AWARDS®",
    The3IndicaçõesAoGOLDENGLOBES = "3 indicações ao GOLDEN GLOBES®",
    The3IndicaçõesAoOSCARS = "3 indicações ao OSCARS®",
    The3Oscars = "3 OSCARS®",
    The4IndicaçõesAoBAFTAFILMAWARDS = "4 indicações ao BAFTA FILM AWARDS®",
    The4Oscars = "4 OSCARS®",
    The5IndicaçõesAoBAFTAFILMAWARDS = "5 indicações ao BAFTA FILM AWARDS®",
    The5Oscars = "5 OSCARS®",
    The6Oscars = "6 OSCARS®",
    The7IndicaçõesAoOSCARS = "7 indicações ao OSCARS®",
    The7NaItália = "#7 na Itália",
    The7Oscars = "7 OSCARS®",
    The8NaItália = "#8 na Itália",
    VencedorDoBAFTAFILMAWARD = "Vencedor do BAFTA FILM AWARD®",
    VencedorDoGOLDENGLOBE = "Vencedor do GOLDEN GLOBE®",
    VencedorDoOSCAR = "Vencedor do OSCAR®",
}

export enum EntityTypeEnum {
    Movie = "Movie",
}

export interface HideThisAction {
    endpoint: HideThisActionEndpoint;
    hasTimer: boolean;
    tag: HideThisActionTag;
    text: TextEnum;
}

export interface HideThisActionEndpoint {
    partialURL: PartialURL;
    query: PurpleQuery;
}

export enum PartialURL {
    RegionNaAPIHideThisRefAtvExfbHTNonHideMv = "/region/na/api/hideThis/ref=atv_exfb_ht_non_hide_mv",
}

export interface PurpleQuery {
    titleType: EntityTypeEnum;
    tag: HideThisActionTag;
    titleId: string;
    token: string;
}

export enum HideThisActionTag {
    Hide = "Hide",
}

export enum TextEnum {
    OcultarEsteFilme = "Ocultar este filme",
}

export interface HoverInfo {
    canHover: boolean;
}

export interface Images {
    cover: CoverClass;
    providerLogo?: CoverClass;
}

export interface CoverClass {
    url: string;
}

export interface ItemAnalytics {
    refMarker: string;
}

export interface MaturityRatingBadge {
    __type: MaturityRatingBadgeType;
    countryCode?: CountryCode;
    description: DescriptionEnum;
    displayText: string;
    id: ID;
    logoUrl?: string;
    simplifiedId?: string;
}

export enum MaturityRatingBadgeType {
    AtvWpsAmazonMaturityRatingBadge = "atv.wps#AmazonMaturityRatingBadge",
    AtvWpsLocalRatingBadge = "atv.wps#LocalRatingBadge",
}

export enum CountryCode {
    Br = "BR",
}

export enum ID {
    VccMaturityRatingAdjctqA10 = "vcc_maturity_rating_adjctq_a10",
    VccMaturityRatingAdjctqA12 = "vcc_maturity_rating_adjctq_a12",
    VccMaturityRatingAdjctqA14 = "vcc_maturity_rating_adjctq_a14",
    VccMaturityRatingAdjctqA16 = "vcc_maturity_rating_adjctq_a16",
    VccMaturityRatingAdjctqA18 = "vcc_maturity_rating_adjctq_a18",
    VccMaturityRatingAdjctqAl = "vcc_maturity_rating_adjctq_al",
    VccMaturityRatingAmazonMaturityRatingNr = "vcc_maturity_rating_amazon_maturity_rating_nr",
    VccMaturityRatingDjctq10 = "vcc_maturity_rating_djctq_10",
    VccMaturityRatingDjctq12 = "vcc_maturity_rating_djctq_12",
    VccMaturityRatingDjctq14 = "vcc_maturity_rating_djctq_14",
    VccMaturityRatingDjctq16 = "vcc_maturity_rating_djctq_16",
    VccMaturityRatingDjctq18 = "vcc_maturity_rating_djctq_18",
    VccMaturityRatingDjctqL = "vcc_maturity_rating_djctq_l",
}

export interface OverflowMenu {
    items: Item[];
    title: OverflowMenuTitle;
}

export interface Item {
    __type: ItemType;
    action: Action;
    itemType: ItemTypeEnum;
    text: String;
}

export enum ItemType {
    AtvWpsOverflowMenuWatchlistItem = "atv.wps#OverflowMenuWatchlistItem",
}

export interface Action {
    ajaxEnabled: boolean;
    endpoint: WatchlistActionEndpoint;
    formatCode: FormatCode;
    tag: WatchlistActionTag;
    text: TextClass;
}

export interface WatchlistActionEndpoint {
    partialURL: string;
    query: FluffyQuery;
}

export interface FluffyQuery {
    titleType: ContentTypeEnum;
    tag: WatchlistActionTag;
    returnUrl: ReturnURL;
    titleID: string;
    token: string;
}

export enum ReturnURL {
    RegionNaStorefrontRefAtvHmWtlSignInHov = "/region/na/storefront/ref=atv_hm_wtl_sign_in_hov",
}

export enum WatchlistActionTag {
    Add = "Add",
}

export enum ContentTypeEnum {
    Movie = "movie",
}

export enum FormatCode {
    Mv = "mv",
}

export interface TextClass {
    attrs: BuyboxMessage;
    string: String;
}

export enum String {
    AdicionarÀSuaLista = "Adicionar à sua Lista",
}

export enum ItemTypeEnum {
    WatchlistAction = "WatchlistAction",
}

export enum OverflowMenuTitle {
    SuaLista = "Sua Lista",
}

export interface PlaybackAction {
    appFallbackUrl: AppFallbackURL;
    disableJs: boolean;
    fallbackUrl: string;
    label: PlaybackActionLabel;
    refMarker: RefMarker;
    sessionID: SessionID;
    titleID: string;
    videoMaterialType: VideoMaterialType;
    resumeTime?: number;
}

export enum AppFallbackURL {
    ItmsAppsItunesAppleCOMUsAppId545519333MT8 = "itms-apps://itunes.apple.com/us/app/id545519333?mt=8",
}

export enum PlaybackActionLabel {
    Reproduzir = "Reproduzir",
}

export enum RefMarker {
    AtvMvHomC78BVjr10_Resume = "atv_mv_hom_c_78BVjr_10_resume",
    AtvMvHomC7X6TUM20_Resume = "atv_mv_hom_c_7X6TUM_20_resume",
    AtvMvHomC8AMFx719_Resume = "atv_mv_hom_c_8AMFx7_19_resume",
    AtvMvHomCBYfbba1118_Resume = "atv_mv_hom_c_BYfbba11_18_resume",
    AtvMvHomCGT7KYq25_Resume = "atv_mv_hom_c_gT7KYq_25_resume",
    AtvMvHomCIAnXf022_Resume = "atv_mv_hom_c_iAnXf0_22_resume",
    AtvMvHomCMEomge15_Resume = "atv_mv_hom_c_mEomge_15_resume",
    AtvMvHomCOB057Ba711_Resume = "atv_mv_hom_c_OB057ba7_11_resume",
    AtvMvHomCOB2822Fc9_Resume = "atv_mv_hom_c_OB2822fc_9_resume",
    AtvMvHomCOB5F98Be12_Resume = "atv_mv_hom_c_OB5f98be_12_resume",
    AtvMvHomCOB75729221_Resume = "atv_mv_hom_c_OB757292_21_resume",
    AtvMvHomCOB82B9Cc16_Resume = "atv_mv_hom_c_OB82b9cc_16_resume",
    AtvMvHomCOB88786723_Resume = "atv_mv_hom_c_OB887867_23_resume",
    AtvMvHomCOBb1E6F213_Resume = "atv_mv_hom_c_OBb1e6f2_13_resume",
    AtvMvHomCOBbc5C5524_Resume = "atv_mv_hom_c_OBbc5c55_24_resume",
    AtvMvHomCOBd58E1E17_Resume = "atv_mv_hom_c_OBd58e1e_17_resume",
    AtvMvHomCOBddbe188_Resume = "atv_mv_hom_c_OBddbe18_8_resume",
}

export enum SessionID {
    The13934380236442448 = "139-3438023-6442448",
}

export enum VideoMaterialType {
    Feature = "Feature",
}

export interface Progress {
    isLive: boolean;
    percentage: number;
}

export enum WidgetType {
    TitleCard = "TitleCard",
}

export interface ContainerEntitlementCues {
    entitledCarousel: EntitledCarousel;
    offerType: OfferType;
}

export enum EntitledCarousel {
    Entitled = "Entitled",
    Mixed = "Mixed",
    NotEntitled = "NotEntitled",
}

export enum OfferType {
    Mixed = "Mixed",
    Svod = "SVOD",
    Tvod = "TVOD",
}

export enum FacetText {
    Prime = "Prime",
}

export enum JourneyIngressContext {
    The8EgNhbGw = "8|EgNhbGw=",
    The8EgR0Dm9K = "8|EgR0dm9k",
    The8EgRzdm9K = "8|EgRzdm9k",
}

export interface SeeMore {
    displayPlacement: DisplayPlacement;
    link: SeeMoreLinkClass;
}

export enum DisplayPlacement {
    Inline = "Inline",
}

export interface SeeMoreLinkClass {
    label: SeeMoreLinkLabel;
    url: string;
}

export enum SeeMoreLinkLabel {
    VejaMais = "Veja mais",
}

export interface Metadata {
    availability: Availability;
}

export interface Availability {
    description: string;
    severity: string;
}

export interface Pagination {
    apiUrl: string;
    ariaLabel: string;
    contentId: string;
    contentType: ContentTypeEnum;
    label: string;
    page: number;
    pageNumber: number;
    pageSize: number;
    queryParameters: QueryParameters;
    requestMethod: string;
    serviceToken: string;
    startIndex: number;
    targetId: string;
    token: string;
    url: string;
}

export interface QueryParameters {
    actionScheme: string;
    contentId: string;
    contentType: ContentTypeEnum;
    decorationScheme: string;
    dynamicFeatures: string[];
    featureScheme: string;
    pageNumber: number;
    pageSize: number;
    serviceToken: string;
    startIndex: string;
    targetId: string;
    widgetScheme: string;
}

export interface Strings {
    DV_DP_TR_dislike_aria: string;
    DV_DP_TR_like_btn: string;
    DV_DP_TR_liked_aria: string;
    DV_WEB_ARIA_PREVIOUS_TITLE: string;
    DV_WEB_MORE_DETAILS: string;
    DV_WEB_DETAILS_TOOLTIP: string;
    DV_DP_TR_disliked_aria: string;
    DV_WEB_OVERFLOW_MENU_TOOLTIP: string;
    DV_WEB_ARIA_NEXT_N_TITLES: string;
    DV_WEB_DISCOVER_FILTERING_FAILED: string;
    DV_WEB_DISCOVER_NO_MATCH: string;
    DV_WEB_Undo_like: string;
    DV_DP_TR_like_aria: string;
    DV_WEB_WATCHLIST_TOOLTIP: string;
    DV_WEB_ARIA_NEXT_TITLE: string;
    DV_DP_TR_dislike_btn: string;
    DV_WEB_ARIA_PREVIOUS_N_TITLES: string;
}

export interface SwiftPageParameters {
    pageId: string;
    pageType: ContentTypeEnum;
}
