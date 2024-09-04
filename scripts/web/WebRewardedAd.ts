import { AdAnalyticsEvents, AdPlacementsData, AdStatus } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IRewardedAd, IRewardedAdController, IRewardedAdDelegate } from "../definitions/IRewardedAd";
import { AdBreakStatus } from "./AdBreakStatus";

declare var adBreak;
declare var adConfig;
export class WebRewardedAd implements IRewardedAd {
    constructor(dependency: IAdsDependencies) {
        this.dependency = dependency;
        this.adUnitMap = dependency.getInterstitialAdsPlacementMap();
    }
    isSupported(): boolean {
        return true;
    }
    isAdAvailable(rewardAdType: string): boolean {
        throw new Error("Method not implemented.");
    }
    init(controller: IRewardedAdController) {
        this.controller = controller;
        this.rewardedAdLoaded = false;
        adConfig({
            sound: 'on',
            onReady: () => {
                console.log('WebRewardedAd: onReady');
                this.rewardedAdLoaded = true;
            }
        });
    }

    loadAd(rewardAdType: string) {
        // No op, seems like showAd is loading on demand
    }

    showAd(rewardAdType: string, initiatedFrom?: string) {
        this.adType = rewardAdType;
        this.initiatedFrom = initiatedFrom;

        adBreak({
            type: "reward",
            name: "reward-ad",
            beforeAd: () => {
                console.log("WebRewardedAd: beforeAd");
                this.controller.onAdShowStarted(this.adType);
            },
            afterAd: () => {
                console.log("WebRewardedAd: afterAd");
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    kingdom: "rewarded",
                    phylum: this.getPlacementId(this.adType),
                    class: this.initiatedFrom ? this.initiatedFrom : "NA",
                });
            },
            beforeReward: (showAdFn) => {
                console.log("WebRewardedAd: beforeReward");
                showAdFn();
            },
            adDismissed: () => {
                console.log("WebRewardedAd: adviewed");
                this.delegate.onRewardCancelled(this.adType);
            },
            adViewed: () => {
                console.log("WebRewardedAd: adviewed");
                this.delegate.onRewardGranted(this.adType);
            },
            adBreakDone: (placementInfo) => {
                console.log("WebRewardedAd: adBreakDone");
                const { breakStatus } = placementInfo;
                if (
                    breakStatus === AdBreakStatus.NOT_READY ||
                    breakStatus === AdBreakStatus.TIMEOUT
                ) {
                    console.log("WebRewardedAd: onAdLoadFailed", breakStatus);
                } else if (
                    breakStatus !== AdBreakStatus.VIEWED &&
                    breakStatus !== AdBreakStatus.DISMISSED
                ) {
                    console.log("WebRewardedAd: onAdShowFailed", breakStatus);
                    this.delegate.onAdFailed(this.adType);
                    this.controller.onAdShowFailed(this.adType);
                }
            },
        });
    }

    setAdDelegate(adDelegate: IRewardedAdDelegate) {
        this.delegate = adDelegate;
    }

    isAdLoaded(rewardAdType: string): boolean {
        return this.rewardedAdLoaded;
    }

    getAdStatus(rewardAdType: string): AdStatus {
        if (this.isAdLoaded(rewardAdType)) {
            return AdStatus.Loaded;
        }
        return AdStatus.NotAvailable;
    }

    removeAdDelegate() {
        this.delegate = null;
    }

    private getPlacementId(adType: string): string {
        return this.adUnitMap[adType];
    }
    private dependency: IAdsDependencies;
    private controller: IRewardedAdController;
    private delegate: IRewardedAdDelegate;
    private adUnitMap: AdPlacementsData = {};
    private adType: string;
    private initiatedFrom = "";
    private rewardedAdLoaded: boolean = false;
}
