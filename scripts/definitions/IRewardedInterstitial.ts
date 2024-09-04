import { AdStatus } from "./AdDefinitions";

export interface IRewardedInterstitialDelegate {
    /** Perform post-ad failed to show operation
     * @param  {string} rewardAdType?
     */
    onAdFailed(rewardAdType: string);
    /** Perform post-ad is cancelled by the user.
     * @param  {string} rewardAdType?
     */
    onRewardCancelled(rewardAdType: string);
    /** Perform post-ad success operation
     * @param  {string} rewardAdType?
     */
    onRewardGranted(rewardAdType: string);
    /**
     * to do something when ad is waiting to be shown.
     */
    onAdShowable();
    onAdLoaded(rewardAdType: string, attemptTaken: number);
    onAdLoadFailed(rewardAdType: string,error: string, attemptTaken: number);
}

// platform specific ad system interface
export interface IRewardedInterstitialAd {
    isSupported(): boolean;
    setAdDelegate(adDelegate: IRewardedInterstitialDelegate): void;
    removeAdDelegate(): void;

    /** Returns true if ad is loaded and ready to show.
     * @param  {string} rewardAdType
     * @returns boolean
     */
    isAdLoaded(rewardAdType: string): boolean;
    getAdStatus(rewardAdType: string): AdStatus;
    isAdAvailable(rewardAdType: string): boolean
    loadAd(rewardAdType: string);
    showAd(rewardAdType: string, initiatedFrom?: string): void;
    init(controller: IRewardedInterstitialController): void;
}

export interface IRewardedInterstitialController {
    isSupported(): boolean;
    onAdLoaded(rewardAdType: string);
    onAdShowStarted(rewardAdType: string);
    onAdShowFailed(rewardAdType: string);
}