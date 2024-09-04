import { Dictionary } from "typescript-collections";

import { AdAnalyticsEvents, AdStatus } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IRewardedInterstitialAd, IRewardedInterstitialController, IRewardedInterstitialDelegate } from "../definitions/IRewardedInterstitial";
import { NativeOnDemandAdUnit } from "./NativeOnDemandAdUnit";

export class NativeRewardedInterstitialAd extends NativeOnDemandAdUnit implements IRewardedInterstitialAd {

    constructor(dependency: IAdsDependencies) {
        super(dependency);
        this.initNativeListener();
        this.initPlacements();
    }

    isSupported(): boolean {
        return true;
    }

    init(controller: IRewardedInterstitialController) {
        this.controller = controller;
    }

    setAdDelegate(adDelegate: IRewardedInterstitialDelegate) {
        this.delegate = adDelegate;
    }

    removeAdDelegate() {
        this.delegate = null;
    }

    isAdLoaded(rewardAdType: string): boolean {
        console.log("isAdLoaded %s", rewardAdType);
        return ads.RewardedInterstitialVideo.getInstance().isAdLoaded();
    }

    isAdAvailable(rewardAdType: string): boolean {
        console.log("isAdAvailable %s", rewardAdType);
        return ads.RewardedInterstitialVideo.getInstance().isAdAvailable();
    }

    getAdStatus(rewardAdType: string): AdStatus {
        if (this.isAdLoaded(rewardAdType)) {
            return AdStatus.Loaded;
        }
        return AdStatus.NotAvailable;
    }

    loadAd(rewardAdType: string) {
        super.loadAd(rewardAdType);;
    }

    showAd(rewardAdType: string, initiatedFrom?: string) {
        this.adType = rewardAdType;
        this.initiatedFrom = initiatedFrom;
        ads.RewardedInterstitialVideo.getInstance().show(rewardAdType, initiatedFrom);
        if (this.delegate) {
            this.delegate.onAdShowable();
        }
    }

    protected attemptToLoadAd(adType: string) {
        ads.RewardedInterstitialVideo.getInstance().load(adType);
    }

    private initPlacements() {
        const placementsData = this.dependency.getRewardedInterstitialAdsPlacementMap();
        const rewardedAd = ads.RewardedInterstitialVideo.getInstance();
        for (const adType in placementsData) {
            const placementId = placementsData[adType];
            this.placementIdMap.setValue(adType, placementId);
            rewardedAd.registerPlacement(adType, placementId);
        }
    }

    private initNativeListener() {
        const listener: ads.IRewardedInterstitialListener = {
            onAdLoaded: () => {
                console.log("NativeRewardedInterstitialAd: onAdLoaded");
                this.controller.onAdLoaded(this.adType);
                this.delegate.onAdLoaded(this.adType, (this.adLoadRetryAttempt + 1));
            },
            onClosed: () => {
                console.log("NativeRewardedInterstitialAd: onClosed");
            },
            onRewardGranted: () => {
                console.log("NativeRewardedInterstitialAd: onRewardGranted");
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    "kingdom": "rewarded_interstitial",
                    "phylum": this.getPlacementId(this.adType),
                    "class": this.initiatedFrom ? this.initiatedFrom : "NA"
                });
                if (this.delegate) {
                    this.delegate.onRewardGranted(this.adType);
                }
            },
            onShown: () => {
                console.log("NativeRewardedInterstitialAd: onShown");
                this.controller.onAdShowStarted(this.adType);
            },
            onLoadFailed: () => {
                console.log("NativeRewardedInterstitialAd: onLoadFailed");
                const errorInfo = "NA"; //TODO: Add error code and info
                this.delegate.onAdLoadFailed(this.adType,errorInfo, (this.adLoadRetryAttempt + 1));
                this.handleAdLoadFailure(this.adType);
            },
            onShowFailed: () => {
                console.log("NativeRewardedInterstitialAd: onShowFailed");
                if (this.delegate) {
                    this.delegate.onAdFailed(this.adType);
                    this.controller.onAdShowFailed(this.adType);
                }
            },
            onRewardCancelled: () => {
                console.log("NativeRewardedInterstitialAd: onRewardCancelled");
                if (this.delegate) {
                    this.delegate.onRewardCancelled(this.adType);
                }
            }
        }
        ads.setRewardedInterstitalListener(listener);
    }

    private getPlacementId(adType: string): string {
        return this.placementIdMap.getValue(adType);
    }

    private controller: IRewardedInterstitialController;
    private delegate: IRewardedInterstitialDelegate;
    private placementIdMap: Dictionary<string, string> = new Dictionary();
    private adType: string;
    private initiatedFrom = "";
    protected TAG: string = "NativeRewardedInterstitialAd";
}