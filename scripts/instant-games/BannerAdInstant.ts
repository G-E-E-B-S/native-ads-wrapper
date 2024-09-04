import { AdAnalyticsEvents } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IBannerAd } from "../definitions/IBannerAd";
import { IBannerAdListener } from "../definitions/IBannerAdListener";
import { AdsUtils } from "../utils/AdsUtils";
import { FBInstantAdsSafe } from "./FBInstantAdsSafe";

enum AdState {
    NONE,
    LOADING,
    SHOWING,
    SHOW_PENDING,
    HIDE_PENDING
}

const MAX_RETRY_COUNT = 3;
const RETRY_TIME_MS = 30 * AdsUtils.SEC_TO_MS;
const REFRESH_TIME_MS = 2 * 60 * AdsUtils.SEC_TO_MS;
const RATE_LIMIT_MS = 40 * AdsUtils.SEC_TO_MS;

export class BannerAdInstant implements IBannerAd {
    static TAG = "BannerAdInstant";

    constructor(dependency: IAdsDependencies) {
        this.adState = AdState.NONE;
        this.retryCount = 0;
        this.dependency = dependency;
    }

    setListener(listener: IBannerAdListener) {
        this.listener = listener;
    }

    isShowing(): boolean {
        return this.adState == AdState.SHOWING;
    }

    showAd(adType: string, launchPoint: string) {
        if (!FBInstantAdsSafe.isApiSupported("loadBannerAdAsync")) {
            return;
        }

        if (this.adState != AdState.NONE) {
            if (this.adState == AdState.HIDE_PENDING) {
                this.setAdPending(adType);
            }
            if (this.adState == AdState.SHOWING) {
                // hide this ad,
                this.hideAd();
                // show another when its hidden.
                this.setAdPending(adType);
            }
            return;
        }

        try {
            this.launchPoint = launchPoint;
            this.adState = AdState.LOADING;
            const placementID = this.getPlacementId(adType);
            FBInstantAdsSafe.loadBannerAdAsync(placementID).then(() => {
                const stateOnLoadFinished = this.adState;
                this.adState = AdState.SHOWING;
                this.retryCount = 0;
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    "kingdom": "banner",
                    "phylum": placementID,
                    "class": launchPoint,
                });

                if (this.listener) {
                    this.listener.onAdShown(placementID, launchPoint);
                }
                if (stateOnLoadFinished == AdState.HIDE_PENDING) {
                    this.hideAd();
                } else {
                    clearTimeout(this.refreshTimeout);
                    clearTimeout(this.retryTimeoutHandler);
                    this.refreshTimeout = setTimeout(() => {
                        this.showAd(adType, launchPoint);
                    }, this.getRefreshRate());
                }
            }).catch((err) => {
                const stateOnLoadFinished = this.adState;
                this.adState = AdState.NONE;
                if (err && err.code) {
                    this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdShowFailure, {
                        "kingdom": "banner",
                        "phylum": err && err.code ? err.code : "unknown",
                        "class": launchPoint,
                        "family": placementID
                    });
                }

                console.log(`${BannerAdInstant.TAG} - showAd error:${JSON.stringify(err)}`);
                if (stateOnLoadFinished == AdState.HIDE_PENDING) {
                    return;
                }
                if (err && (err.code == "ADS_NO_FILL" || err.code == "RATE_LIMITED") && this.retryCount < MAX_RETRY_COUNT) {
                    this.retryCount++;
                    clearTimeout(this.refreshTimeout);
                    clearTimeout(this.retryTimeoutHandler);
                    this.retryTimeoutHandler = setTimeout(() => {
                        this.showAd(adType, launchPoint);
                    }, this.getRetryTime());
                }
            });
        } catch (err) {
            this.adState = AdState.NONE;
            console.log(`${BannerAdInstant.TAG} - showAd error:${JSON.stringify(err)}`);
        }
    }

    hideAd() {
        if (!FBInstantAdsSafe.isApiSupported("hideBannerAdAsync")) {
            return;
        }

        clearTimeout(this.refreshTimeout);
        clearTimeout(this.retryTimeoutHandler);
        if (this.adState == AdState.LOADING) {
            this.adState = AdState.HIDE_PENDING;
            return;
        }
        if (this.adState == AdState.SHOW_PENDING) {
            // set it to showing so that hide logic below gets triggered
            this.adState = AdState.SHOWING;
        }
        if (this.adState == AdState.SHOWING) {
            this.adState = AdState.HIDE_PENDING;
            FBInstantAdsSafe.hideBannerAdAsync().then(() => {
                const stateOnHideFinished = this.adState;
                this.adState = AdState.NONE;
                if (stateOnHideFinished == AdState.SHOW_PENDING) {
                    this.showAd(this.pendingAdType, this.launchPoint);
                }
            }).catch((err) => {
                this.adState = AdState.NONE;
                console.log(`${BannerAdInstant.TAG} - hideAd error:${JSON.stringify(err)}`);
            });
        }
    }

    getRateLimitMs(): number {
        return RATE_LIMIT_MS;
    }

    getPlacementId(adType: string): string {
        const placementData = this.dependency.getBannerAdsPlacementMap();
        if (placementData[adType]) {
            return placementData[adType];
        }
        console.error("No placement found, returning empty")
        return "";
    }

    private setAdPending(adType: string) {
        this.adState = AdState.SHOW_PENDING;
        this.pendingAdType = adType;
    }

    private getRetryTime(): number {
        return this.retryCount * RETRY_TIME_MS;
    }

    private getRefreshRate(): number {
        return REFRESH_TIME_MS;
    }

    private dependency: IAdsDependencies;
    private adState: AdState;
    private pendingAdType: string;
    private retryCount: number;
    private listener: IBannerAdListener;
    private retryTimeoutHandler;
    private refreshTimeout;
    private launchPoint: string;
}
