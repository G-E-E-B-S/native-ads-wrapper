import { Dictionary } from "typescript-collections";
import { AdAnalyticsEvents } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IInterstitialAd, IInterstitialAdDelegate } from "../definitions/IInterstitialAd";
import { NativeOnDemandAdUnit } from "./NativeOnDemandAdUnit";

export class NativeInterstitialAd extends NativeOnDemandAdUnit implements IInterstitialAd {
    constructor(dependency: IAdsDependencies) {
        super(dependency)
        this.initNativeListener();
        this.initPlacements();
    }

    isSupported(): boolean {
        return true;
    }

    getAdPlacementID(interstitialAdType: string): string {
        return this.placementIdMap.getValue(interstitialAdType);
    }

    isAdLoaded(interstitialAdType: string): boolean {
        console.log("isAdLoaded %s", interstitialAdType);
        return ads.Interstitial.getInstance().isAdLoaded();
    }

    isAdAvailable(interstitialAdType: string): boolean {
        console.log("isAdAvailable %s", interstitialAdType);
        return ads.Interstitial.getInstance().isAdAvailable();
    }

    loadAd(interstitialAdType: string) {
        super.loadAd(interstitialAdType);
    }

    protected attemptToLoadAd(adType: string) {
        ads.Interstitial.getInstance().load(adType);
    }

    showAd(interstitialAdType: string, initiatedFrom: string): void {
        this.initiatedFrom = initiatedFrom;
        this.adType = interstitialAdType;
        ads.Interstitial.getInstance().show(interstitialAdType, initiatedFrom)
    }

    setAdDelegate(adDelegate: IInterstitialAdDelegate): void {
        this.delegate = adDelegate;
    }

    private initPlacements() {
        const deps = this.dependency;
        const placementsData = deps.getInterstitialAdsPlacementMap();
        const nativeAds = ads.Interstitial.getInstance();
        for (const adType in placementsData) {
            const placementId = placementsData[adType];
            this.placementIdMap.setValue(adType, placementId);
            nativeAds.registerPlacement(adType, placementId);
        }
    }

    private initNativeListener() {
        const listener: ads.IInterstialListener = {
            onClosed: () => {
                console.log("NativeInterstitialAd::onClosed");
            },
            onShown: () => {
                console.log("NativeInterstitialAd::onShown");
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    "kingdom": "interstitial",
                    "phylum": this.getAdPlacementID(this.adType),
                    "class": this.initiatedFrom
                });
                if (this.delegate) {
                    this.delegate.onAdShown();
                }
            },
            onLoadFailed: () => {
                console.log("NativeInterstitialAd::onLoadFailed");
                const errorInfo = "NA"; //TODO: Add error code and info
                if (this.delegate) {
                    this.delegate.onAdLoadFailed(this.adType, errorInfo, (this.adLoadRetryAttempt + 1));
                }
            },
            onShowFailed: () => {
                console.log("NativeInterstitialAd::onShowFailed");
                if (this.delegate) {
                    this.delegate.onAdShowFailed();
                }
            }
        }
        ads.setInterstitialListener(listener);
    }

    private placementIdMap: Dictionary<string, string> = new Dictionary();
    private delegate: IInterstitialAdDelegate;
    private adType: string;
    private initiatedFrom = "";
    protected TAG: string = "NativeInterstitialAd";
}