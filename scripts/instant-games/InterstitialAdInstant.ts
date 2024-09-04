import { Dictionary } from "typescript-collections";

import { AdAnalyticsEvents, AdStatus, AdType } from "../definitions/AdDefinitions";
import { AdUnit } from "../definitions/AdUnit";
import { IAdCollectionDelegate } from "../definitions/IAdCollectionDelegate";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IInterstitialAd, IInterstitialAdDelegate } from "../definitions/IInterstitialAd";
import { FBInstantAdsSafe } from "./FBInstantAdsSafe";

export class InterstitialAdInstant implements IInterstitialAd, IAdCollectionDelegate {
    private TAG = "InterstitialAdControllerInstant";
    private delegate: IInterstitialAdDelegate;
    private dependency: IAdsDependencies;

    constructor(dependency: IAdsDependencies) {
        this.dependency = dependency;
        this.initAdUnits();
    }
    isSupported(): boolean {
        return this.isInterstitialSupported();
    }

    onAdShowStarted() {
        console.log("onAdShowStarted");
    }

    setAdDelegate(adDelegate: IInterstitialAdDelegate) {
        this.delegate = adDelegate;
    }

    removeAdDelegate() {
        this.delegate = null;
    }

    isAdLoaded(interstitialAdType: string): boolean {
        const adsStatus = this.getAdStatus(interstitialAdType);
        return adsStatus == AdStatus.Loaded
    }

    isAdAvailable(interstitialAdType: string): boolean {
        const adsStatus = this.getAdStatus(interstitialAdType);
        return adsStatus == AdStatus.Loaded || adsStatus == AdStatus.Loading || adsStatus == AdStatus.Creating;
    }

    loadAd(interstitialAdType: string) {
        const adUnit = this.adUnitsCollection.getValue(interstitialAdType);
        if (adUnit) {
            adUnit.loadAd();
        }
    }

    showAd(interstitialAdType: string, initiatedFrom: string) {
        if (!this.isInterstitialSupported()) {
            this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdShowFailure, {
                "kingdom": "interstitial",
                "phylum": "API not supported",
                "class": this.getAdPlacementID(interstitialAdType)
            });
            console.log(this.TAG + " - FBInstant getInterstitialAdAsync Api not supported");
            setTimeout(() => {
                // makes sure to avoid infinite recursion issue
                this.onAdLoadFailed(this.getAdPlacementID(interstitialAdType), "API not supported");
            });
            return;
        }

        if (!this.delegate) {
            this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdShowFailure, {
                "kingdom": "interstitial",
                "phylum": "Delegate not set",
                "class": this.getAdPlacementID(interstitialAdType)
            });
            console.log(this.TAG + " - Delegate not set");
            return;
        }

        if (this.adUnitsCollection.containsKey(interstitialAdType)) {
            this.adUnitsCollection.getValue(interstitialAdType).showAd(initiatedFrom);
        } else {
            throw ("Specified Ad type is not initialized.");
        }
    }

    onAdLoaded(placementId: string) {
        this.adUnitsCollection.forEach((rewardAdType: string, adUnit: AdUnit) => {
            if (placementId == adUnit.getPlacementID()) {
                this.delegate.onAdLoaded(rewardAdType, adUnit.getAdLoadRetryCount() + 1);
            }
        });
    }

   onAdLoadFailed(placementId: string, error: string) {
        console.log(`Failed to load interstitial`);
        this.adUnitsCollection.forEach((rewardAdType: string, adUnit: AdUnit) => {
            if (placementId == adUnit.getPlacementID()) {
                this.delegate.onAdLoadFailed(rewardAdType, error, adUnit.getAdLoadRetryCount() + 1);
            }
        });
    }

    onAdShown(placementId: string, initiatedFrom: string) {
        console.log(this.TAG + " - display Interstitial done");
        this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
            "kingdom": "interstitial",
            "phylum": placementId,
            "class": initiatedFrom
        });
        this.delegate.onAdShown();
    }

    onAdShowFailed(err) {
        this.logAdShowFailure(err);
        if (this.delegate) {
            this.delegate.onAdShowFailed();
        }
    }

    getAdPlacementID(interstitialAdType: string): string {
        if (!this.adUnitsCollection) {
            return "NA";
        }
        if (!this.adUnitsCollection.containsKey(interstitialAdType)) {
            return "NA";
        }
        return this.adUnitsCollection.getValue(interstitialAdType).getPlacementID();
    }

    private initAdUnits() {
        if (!this.isInterstitialSupported()) {
            console.log(this.TAG + " - FBInstant getInterstitialAdAsync Api not supported");
            this.dependency.logAnalyticsEvent(
                AdAnalyticsEvents.ApiError, {
                "kingdom": "api_not_supported",
                "phylum": "getInterstitialAdAsync"
            });
            return;
        }
        const placementsData = this.dependency.getInterstitialAdsPlacementMap();
        for (const adType in placementsData) {
            const placementId = placementsData[adType];
            this.initAdUnit(adType, placementId);
        }
    }

    private initAdUnit(adType: string, placementId: string) {
        let adUnit: AdUnit = this.adUnitPlacementKeyMap.getValue(placementId);
        if (!adUnit) {
            adUnit = new AdUnit(placementId, this, AdType.Interstitial, this.dependency);
            this.adUnitPlacementKeyMap.setValue(placementId, adUnit);
        }
        this.adUnitsCollection.setValue(adType, adUnit);
    }

    private getAdStatus(interstitialAdType: string): AdStatus {
        if (!this.isInterstitialSupported()) {
            console.log(this.TAG + " - FBInstant getInterstitialAdAsync Api not supported");
            return AdStatus.NotAvailable;
        }

        if (this.adUnitsCollection.containsKey(interstitialAdType)) {
            return this.adUnitsCollection.getValue(interstitialAdType).getAdStatus();
        } else {
            throw ("Ad is not initialized.");
        }
    }

    private isInterstitialSupported() {
        return FBInstantAdsSafe.isApiSupported("getInterstitialAdAsync");
    }

    private logAdShowFailure(err) {
        console.log(`Failed to show interstitial : ${JSON.stringify(err)}`);
    }

    private adUnitsCollection: Dictionary<string, AdUnit> = new Dictionary();
    private adUnitPlacementKeyMap: Dictionary<string, AdUnit> = new Dictionary();
}
