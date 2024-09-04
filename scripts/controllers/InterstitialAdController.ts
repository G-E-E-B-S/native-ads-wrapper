// this represents functionality of interstitial common to all platforms
// allows to you access platform specific implementation

import { IInterstitialAd, IInterstitialAdDelegate } from "../definitions/IInterstitialAd";

export class InterstitialAdController {
    private static instance: InterstitialAdController;
    private interstitialAd: IInterstitialAd;
    static getInstance(): InterstitialAdController {
        if (!this.instance)
            this.instance = new InterstitialAdController();
        return this.instance;
    }
    init(controller: IInterstitialAd) {
        this.interstitialAd = controller;
    }
    isSupported(): boolean {
        return this.interstitialAd.isSupported();
    }
    isAdLoaded(interstitialAdType: string): boolean {
        return this.interstitialAd.isAdLoaded(interstitialAdType);
    }
    isAdAvailable(interstitialAdType: string): boolean {
        return this.interstitialAd.isAdAvailable(interstitialAdType);
    }
    loadAd(interstitialAdType: string) {
        this.interstitialAd.loadAd(interstitialAdType);
    }
    showAd(interstitialAdType: string, initiatedFrom: string) {
        this.interstitialAd.showAd(interstitialAdType, initiatedFrom);
    }
    getAdPlacementID(interstitialAdType: string): string {
        return this.interstitialAd.getAdPlacementID(interstitialAdType);
    }
    setAdDelegate(adDelegate: IInterstitialAdDelegate) {
        this.interstitialAd.setAdDelegate(adDelegate);
    }
}
