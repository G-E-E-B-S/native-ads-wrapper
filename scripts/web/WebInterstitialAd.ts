import { AdAnalyticsEvents, AdPlacementsData } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import {
    IInterstitialAd,
    IInterstitialAdDelegate
} from "../definitions/IInterstitialAd";
import { AdBreakStatus } from './AdBreakStatus';

declare var adBreak;
declare var adConfig;
export class WebInterstitialAd implements IInterstitialAd {
    constructor(dependency: IAdsDependencies) {
        this.dependency = dependency;
        this.init();
    }
    isSupported(): boolean {
        return true;;
    }
    isAdLoaded(interstitialAdType: string): boolean {
        return this.interstitialAdLoaded;
    }
    getAdPlacementID(interstitialAdType: string): string {
        return this.adUnitMap[interstitialAdType];
    }
    loadAd(interstitialAdType: string) {
        // No op, seems like showAd is loading on demand
    }
    showAd(interstitialAdType: string, initiatedFrom: string): void {
        this.initiatedFrom = initiatedFrom;
        this.adType = interstitialAdType;

        adBreak({
            type: "start",
            name: "interstitial-ad",
            beforeAd: () => {
                console.log("WebInterstitialAd: beforeAd");
            },
            afterAd: () => {
                console.log("WebInterstitialAd: afterAd");
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    "kingdom": "interstitial",
                    "phylum": this.getAdPlacementID(this.adType),
                    "class": this.initiatedFrom
                });
                this.delegate.onAdShown();
            },
            adBreakDone: (placementInfo) => {
                console.log("WebInterstitialAd: adBreakDone");
                const { breakStatus } = placementInfo;
                if (breakStatus === AdBreakStatus.NOT_READY || breakStatus === AdBreakStatus.TIMEOUT) {
                    console.log("WebInterstitialAd: onAdLoadFailed");
                    this.delegate.onAdLoadFailed();
                } else if (breakStatus !== AdBreakStatus.VIEWED) {
                    console.log("WebInterstitialAd: onAdShowFailed");
                    this.delegate.onAdShowFailed();
                }
            },
        });
    }

    setAdDelegate(adDelegate: IInterstitialAdDelegate): void {
        this.delegate = adDelegate;
    }

    isAdAvailable(interstitialAdType: string): boolean {
        return this.interstitialAdLoaded;
    }

    private init() {
        this.adUnitMap = this.dependency.getInterstitialAdsPlacementMap();
        this.interstitialAdLoaded = false;
        adConfig({
            sound: 'off',
            onReady: () => {
                console.log('WebInterstitialAd: onReady');
                this.interstitialAdLoaded = true;
            }
        });
    }
    private dependency: IAdsDependencies;
    private adUnitMap: AdPlacementsData = {};
    private delegate: IInterstitialAdDelegate;
    private adType: string;
    private initiatedFrom = "";
    private interstitialAdLoaded: boolean;
}
