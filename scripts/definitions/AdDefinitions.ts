export enum AdStatus {
	NotAvailable = 0,
	Creating = 1,
	Created = 2,
	NotLoaded = 3,
	Loading = 4,
	Loaded = 5,
	Showing = 6,
}

export enum AdType {
	Interstitial = "interstitial",
	Rewarded = "rewarded",
	RewardedInterstitial = "rewarded_interstitial",
}

export enum AdAnalyticsEvents {
	AdLoadFailure = "ad_load_failure",
	AdCreateFailure = "ad_create_failure",
	AdShowFailure = "ad_show_failure",
    AdImpression = "adv_impression",
	ApiError = "api_error",
}

export type AdPlacementsData = {[adType: string]: string};

export interface BannerPlacementData {
	adType: string;
	placementId: string;
}

export interface FBApiError {
    code: FBApiErrorCode | string;
    message: string;
}

export enum FBApiErrorCode {
    SAME_CONTEXT = "SAME_CONTEXT",
    ADS_NO_FILL = "ADS_NO_FILL",
    USER_INPUT = "USER_INPUT",
	ADS_NOT_LOADED = "ADS_NOT_LOADED"
}