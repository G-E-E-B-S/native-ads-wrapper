import { AdStatus } from "../definitions/AdDefinitions";
import { IRewardedInterstitialAd, IRewardedInterstitialController, IRewardedInterstitialDelegate } from "../definitions/IRewardedInterstitial";

export class WebRewardedInterstitialAd implements IRewardedInterstitialAd {
    loadAd(rewardAdType: string) {
        throw new Error("Method not implemented.");
    }
    isSupported(): boolean {
        throw new Error("Method not implemented.");
    }
    setAdDelegate(adDelegate: IRewardedInterstitialDelegate): void {
        throw new Error("Method not implemented.");
    }
    removeAdDelegate(): void {
        throw new Error("Method not implemented.");
    }
    isAdLoaded(rewardAdType: string): boolean {
        throw new Error("Method not implemented.");
    }
    getAdStatus(rewardAdType: string): AdStatus {
        throw new Error("Method not implemented.");
    }
    isAdAvailable(rewardAdType: string): boolean {
        throw new Error("Method not implemented.");
    }
    showAd(rewardAdType: string, initiatedFrom?: string): void {
        throw new Error("Method not implemented.");
    }
    init(controller: IRewardedInterstitialController): void {
        throw new Error("Method not implemented.");
    }
}