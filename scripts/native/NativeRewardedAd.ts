import { Dictionary } from "typescript-collections";

import { AdAnalyticsEvents, AdStatus } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IRewardedAd, IRewardedAdController, IRewardedAdDelegate } from "../definitions/IRewardedAd";
import { NativeOnDemandAdUnit } from "./NativeOnDemandAdUnit";

export class NativeRewardedAd extends NativeOnDemandAdUnit implements IRewardedAd {

    constructor(dependency: IAdsDependencies) {
        super(dependency);
        this.initNativeListener();
        this.initPlacements();
    }

    isSupported(): boolean {
        return true;
    }

    init(controller: IRewardedAdController) {
        this.controller = controller;
    }

    setAdDelegate(adDelegate: IRewardedAdDelegate) {
        this.delegate = adDelegate;
    }

    removeAdDelegate() {
        this.delegate = null;
    }

    isAdLoaded(rewardAdType: string): boolean {
        console.log("isAdLoaded %s", rewardAdType);
        return ads.RewardedVideo.getInstance().isAdLoaded();
    }

    isAdAvailable(rewardAdType: string): boolean {
        console.log("isAdAvailable %s", rewardAdType);
        return ads.RewardedVideo.getInstance().isAdAvailable();
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
        ads.RewardedVideo.getInstance().show(rewardAdType, initiatedFrom);
        if (this.delegate) {
            this.delegate.onAdShowable();
        }
    }

    private initPlacements() {
        const placementsData = this.dependency.getRewardedAdsPlacementMap();
        const rewardedAd = ads.RewardedVideo.getInstance();
        for (const adType in placementsData) {
            const placementId = placementsData[adType];
            this.placementIdMap.setValue(adType, placementId);
            rewardedAd.registerPlacement(adType, placementId);
        }
    }

    private initNativeListener() {
        const listener: ads.IRewardedListener = {
            onAdLoaded: () => {
                console.log("NativeRewardedAd: onAdLoaded");
                this.controller.onAdLoaded(this.adType);
                this.delegate.onAdLoaded(this.adType, (this.adLoadRetryAttempt + 1));
            },
            onClosed: () => {
                console.log("NativeRewardedAd: onClosed");
            },
            onRewardGranted: () => {
                console.log("NativeRewardedAd: onRewardGranted");
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    "kingdom": "rewarded",
                    "phylum": this.getPlacementId(this.adType),
                    "class": this.initiatedFrom ? this.initiatedFrom : "NA"
                });
                if (this.delegate) {
                    this.delegate.onRewardGranted(this.adType);
                }
            },
            onShown: () => {
                console.log("NativeRewardedAd: onShown");
                this.controller.onAdShowStarted(this.adType);
            },
            onLoadFailed: () => {
                console.log("NativeRewardedAd: onLoadFailed");
                const errorInfo = "NA"; //TODO: Add error code and info
                this.delegate.onAdLoadFailed(this.adType, errorInfo, (this.adLoadRetryAttempt + 1));
                this.handleAdLoadFailure(this.adType);
            },
            onShowFailed: () => {
                console.log("NativeRewardedAd: onShowFailed");
                if (this.delegate) {
                    this.delegate.onAdFailed(this.adType);
                    this.controller.onAdShowFailed(this.adType);
                }
            },
            onRewardCancelled: () => {
                console.log("NativeRewardedAd: onRewardCancelled");
                if (this.delegate) {
                    this.delegate.onRewardCancelled(this.adType);
                }
            }
        }
        ads.setRewardedListener(listener)
    }

    protected attemptToLoadAd(rewardAdType: string) {
        ads.RewardedVideo.getInstance().load(rewardAdType);
    }

    private getPlacementId(adType: string): string {
        return this.placementIdMap.getValue(adType);
    }

    private controller: IRewardedAdController;
    private delegate: IRewardedAdDelegate;
    private placementIdMap: Dictionary<string, string> = new Dictionary();
    private adType: string;
    private initiatedFrom = "";
    protected TAG: string = "NativeRewardedAd";
}