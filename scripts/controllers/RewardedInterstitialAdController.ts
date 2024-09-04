import { Dictionary } from "typescript-collections";
import { AdsDepsContainer } from "../definitions/AdsDepsContainer";
import { IRewardedInterstitialAd, IRewardedInterstitialController, IRewardedInterstitialDelegate } from "../definitions/IRewardedInterstitial";

interface PendingAdHandler {
    adSource: string;
    pendingTimer;
}

export class RewardedInterstitialAdController implements IRewardedInterstitialController {
    static getInstance(): RewardedInterstitialAdController {
        if (!this.instance)
            this.instance = new RewardedInterstitialAdController();
        return this.instance;
    }

    isSupported(): boolean {
        return this.rewardedAd.isSupported();
    }

    init(controller: IRewardedInterstitialAd) {
        this.rewardedAd = controller;
        this.rewardedAd.init(this);
        this.isInited = true;
    }

    /** Set the current ad delegate.
     * @param  {IRewardedInterstitialDelegate} adDelegate
     */
    setAdDelegate(adDelegate: IRewardedInterstitialDelegate) {
        if (!this.isInited) {
            console.error("RewardedInterstitialController::setAdDelegate Controller not initialized");
            return;
        }
        this.rewardedAdDelegate = adDelegate;
        this.rewardedAd.setAdDelegate(adDelegate);
    }

    removeAdDelegate() {
        if (!this.isInited) {
            console.error("RewardedInterstitialController::removeAdDelegate Controller not initialized");
            return;
        }
        this.rewardedAdDelegate = null;
        this.rewardedAd.removeAdDelegate();
    }

    loadAd(rewardAdType: string) {
        if (!this.isInited) {
            console.error("RewardedInterstitialController::showAd Controller not initialized");
            return;
        }
        this.rewardedAd.loadAd(rewardAdType);
    }

    showAd(rewardAdType: string, initiatedFrom: string) {
        if (!this.isInited) {
            console.error("RewardedInterstitialController::showAd Controller not initialized");
            return;
        }
        if (!this.rewardedAd.isAdLoaded(rewardAdType)) {
            this.setPendingAdHandler(rewardAdType, initiatedFrom);
        }
        this.rewardedAd.showAd(rewardAdType, initiatedFrom);
    }

    isAdLoaded(rewardAdType: string): boolean {
        if (!this.isInited) {
            console.error("RewardedInterstitialController::isAdLoaded Controller not initialized");
            return false;
        }
        return this.rewardedAd.isAdLoaded(rewardAdType);
    }

    isAdAvailable(rewardAdType: string): boolean {
        if (!this.isInited) {
            console.error("RewardedInterstitialController::isAdAvailable Controller not initialized");
            return false;
        }
        return this.rewardedAd.isAdAvailable(rewardAdType);
    }

    onAdLoaded(rewardAdType: string) {
        AdsDepsContainer.getDeps().dispatchEvent(RewardedInterstitialController.Events.AdLoaded);
        if (this.pendingAds.containsKey(rewardAdType)) {
            this.clearPendingAdHandler(rewardAdType);
            this.rewardedAd.showAd(rewardAdType, this.pendingAds.getValue(rewardAdType).adSource);
        }
    }

    onAdShowStarted(rewardAdType: string) {
        this.clearPendingAdHandler(rewardAdType);
    }

    onAdShowFailed(rewardAdType: string) {
        this.clearPendingAdHandler(rewardAdType);
    }

    private clearPendingAdHandler(rewardAdType: string): void {
        if (this.pendingAds.containsKey(rewardAdType)) {
            clearTimeout(this.pendingAds.getValue(rewardAdType).pendingTimer);
            this.pendingAds.remove(rewardAdType);
        }
    }

    private setPendingAdHandler(rewardAdType: string, initiatedFrom: string): void {
        const pendingTimer = setTimeout(() => {
            this.clearPendingAdHandler(rewardAdType);
            this.rewardedAdDelegate?.onAdFailed(rewardAdType);
        }, AdsDepsContainer.getDeps().getAdLoadWaitTimeout());

        this.pendingAds.setValue(rewardAdType, {
            adSource: initiatedFrom,
            pendingTimer: pendingTimer
        });
    }

    private static instance: RewardedInterstitialAdController;

    private isInited = false;
    private rewardedAd: IRewardedInterstitialAd;
    private rewardedAdDelegate: IRewardedInterstitialDelegate;
    private pendingAds: Dictionary<string, PendingAdHandler> = new Dictionary();
}

export namespace RewardedInterstitialController {
    export enum Events {
        AdLoaded = "AdLoaded",
        SetAdText = "SetAdText",
        ContinueAdWatchSuccessful = "ContinueAdWatchSuccessful",
        ContinueRewardSkipped = "ContinueRewardSkipped"
    }
}
