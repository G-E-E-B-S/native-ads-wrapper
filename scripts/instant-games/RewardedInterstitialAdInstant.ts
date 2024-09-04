import { Dictionary } from "typescript-collections";

import { AdAnalyticsEvents, AdStatus, AdType, FBApiError, FBApiErrorCode } from "../definitions/AdDefinitions";
import { AdUnit } from "../definitions/AdUnit";
import { IAdCollectionDelegate } from "../definitions/IAdCollectionDelegate";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IRewardedInterstitialAd, IRewardedInterstitialController, IRewardedInterstitialDelegate } from "../definitions/IRewardedInterstitial";
import { FBInstantAdsSafe } from "./FBInstantAdsSafe";

export class RewardedInterstitialAdInstant implements IAdCollectionDelegate, IRewardedInterstitialAd {
    private TAG = "RewardedAdControllerInstant";
    private delegate: IRewardedInterstitialDelegate;
    private adController: IRewardedInterstitialController;
    private dependency: IAdsDependencies;

    constructor(dependency: IAdsDependencies) {
        this.dependency = dependency;
        this.initAdUnits();
    }
    isSupported(): boolean {
        return this.isVideoRewardSupported();
    }

    init(adController: IRewardedInterstitialController) {
        this.adController = adController;
    }

    onAdShowStarted(placementId: string) {
        this.adUnitsCollection.forEach((rewardAdType: string, adUnit: AdUnit) => {
            if (placementId == adUnit.getPlacementID()) {
                this.adController.onAdShowStarted(rewardAdType);
            }
        });
    }

    setAdDelegate(adDelegate: IRewardedInterstitialDelegate) {
        this.delegate = adDelegate;
    }

    removeAdDelegate() {
        this.delegate = null;
    }

    isAdLoaded(rewardAdType: string): boolean {
        const adsStatus = this.getAdStatus(rewardAdType);
        return adsStatus == AdStatus.Loaded;
    }

    isAdAvailable(rewardAdType: string): boolean {
        const adsStatus = this.getAdStatus(rewardAdType);
        return adsStatus == AdStatus.Loaded || adsStatus == AdStatus.Loading || adsStatus == AdStatus.Creating;
    }

    loadAd(rewardAdType: string) {
        const adUnit = this.adUnitsCollection.getValue(rewardAdType);
        if (adUnit) {
            adUnit.loadAd();
        }
    }

    showAd(rewardAdType: string, initiatedFrom: string) {
        this.currentAdType = rewardAdType;
        const onAdFailure = () => {
            setTimeout(() => { // makes sure to avoid infinite recursion issue
                // as in some cases error handling might be triggered in the same stack
                this.delegate.onAdFailed(this.currentAdType);
                this.adController.onAdShowFailed(rewardAdType);
            });
        }
        if (!this.isVideoRewardSupported()) {
            console.error(this.TAG + " - FBInstant getRewardedVideoAsync Api not supported");
            onAdFailure();
            return;
        }

        if (this.adUnitsCollection.containsKey(rewardAdType)) {
            if (this.delegate) {
                this.delegate.onAdShowable();
            }
            this.adUnitsCollection.getValue(rewardAdType).showAd(initiatedFrom);
            return;
        }
        const msg = `Specified Ad type is not initialized ${rewardAdType}`;
        this.dependency.logError(msg);
        console.error(msg);
        if (this.adController) {
            onAdFailure();
        } else {
            this.dependency.logError("ad controller not set");
            console.error("ad controller not set");
        }
        return;
    }

    onAdLoaded(placementId: string) {
        this.adUnitsCollection.forEach((rewardAdType: string, adUnit: AdUnit) => {
            if (placementId == adUnit.getPlacementID()) {
                this.delegate.onAdLoaded(rewardAdType, adUnit.getAdLoadRetryCount() + 1);
                this.adController.onAdLoaded(rewardAdType);
            }
        });
    }

    onAdLoadFailed(placementId: string, error: string) {
        console.log("onAdLoadFailed %s");
        this.adUnitsCollection.forEach((rewardAdType: string, adUnit: AdUnit) => {
            if (placementId == adUnit.getPlacementID()) {
                this.adController.onAdLoaded(rewardAdType);
                this.delegate.onAdLoadFailed(rewardAdType, error, adUnit.getAdLoadRetryCount() + 1);
            }
        });
    }

    onAdShown(placementId: string, initiatedFrom: string) {
        console.log(this.TAG + " - displayRewardedVideoInstance done");
        this.onRewardGranted(placementId, initiatedFrom);
    }

    onAdShowFailed(placementId: string, err: FBApiError) {
        this.logAdShowFailure(err);
        if (this.delegate) {
            if (err && err.code == FBApiErrorCode.USER_INPUT) {
                this.delegate.onRewardCancelled(this.currentAdType);
            } else {
                this.delegate.onAdFailed(this.currentAdType);
            }
            this.adUnitsCollection.forEach((rewardAdType: string, adUnit: AdUnit) => {
                if (placementId == adUnit.getPlacementID()) {
                    this.adController.onAdShowFailed(rewardAdType);
                }
            });
        }
    }

    onRewardGranted(placementId: string, initiatedFrom: string) {
        console.log(this.TAG + " - onRewardGranted");
        this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
            "kingdom": "rewarded",
            "phylum": placementId,
            "class": initiatedFrom
        });
        if (this.delegate) {
            this.delegate.onRewardGranted(this.currentAdType);
        }
    }

    getAdStatus(rewardAdType: string): AdStatus {
        if (!this.isVideoRewardSupported()) {
            return AdStatus.NotAvailable;
        }
        if (this.adUnitsCollection.containsKey(rewardAdType)) {
            return this.adUnitsCollection.getValue(rewardAdType).getAdStatus();
        } else {
            const msg = `Ad is not initialized ${rewardAdType}`;
            this.dependency.logError(msg);
            console.error(msg);
            return AdStatus.Loading;
        }
    }

    private initAdUnits() {
        if (!this.isVideoRewardSupported()) {
            console.log(this.TAG + " - FBInstant getRewardedInterstitialAsync Api not supported");
            this.dependency.logAnalyticsEvent(
                AdAnalyticsEvents.ApiError, {
                "kingdom": "api_not_supported",
                "phylum": "getRewardedInterstitialAsync"
            });
            return;
        }
        const placementsData = this.dependency.getRewardedInterstitialAdsPlacementMap();
        for (const adType in placementsData) {
            const placementId = placementsData[adType];
            this.initAdUnit(adType, placementId);
        }
    }

    private initAdUnit(adType: string, placementId: string) {
        let adUnit: AdUnit = this.adUnitPlacementKeyMap.getValue(placementId);
        if (!adUnit) {
            adUnit = new AdUnit(placementId, this, AdType.RewardedInterstitial, this.dependency);
            this.adUnitPlacementKeyMap.setValue(placementId, adUnit);
        }
        this.adUnitsCollection.setValue(adType, adUnit);
    }

    private logAdShowFailure(err) {
        console.error(`Failed to show rewarded video: ${JSON.stringify(err)}`);
    }

    private isVideoRewardSupported(): boolean {
        return FBInstantAdsSafe.isApiSupported("getRewardedInterstitialAsync");

    }

    /**
     * Dictionary by ad type.
     * Type is defined by game.
     */
    private adUnitsCollection: Dictionary<string, AdUnit> = new Dictionary();
    /**
     * Dictionary by placement id.
     * placement is defined by ad network.
     */
    private adUnitPlacementKeyMap: Dictionary<string, AdUnit> = new Dictionary();
    private currentAdType: string;
}
