import { Dictionary } from "typescript-collections";
import { AdsDepsContainer } from "../definitions/AdsDepsContainer";
import {
    IRewardedAd, IRewardedAdController,
    IRewardedAdDelegate
} from "../definitions/IRewardedAd";

interface PendingAdHandler {
    adSource: string;
    pendingTimer;
}

export class RewardedAdController implements IRewardedAdController {
    static getInstance(): RewardedAdController {
        if (!this.instance)
            this.instance = new RewardedAdController();
        return this.instance;
    }
    isSupported(): boolean {
        return this.rewardedAd.isSupported();
    }
    init(controller: IRewardedAd) {
        this.rewardedAd = controller;
        this.rewardedAd.init(this);
        this.isInited = true;
    }
    /** Set the current ad delegate.
     * @param  {IRewardedAdDelegate} adDelegate
     */
    setAdDelegate(adDelegate: IRewardedAdDelegate) {
        console.log("setAdDelegate");
        if (!this.isInited) {
            console.error("RewardedAdController::setAdDelegate Controller not initialized");
            return;
        }
        this.rewardedAdDelegate = adDelegate;
        this.rewardedAd.setAdDelegate(adDelegate);
    }

    removeAdDelegate() {
        console.log("removeAdDelegate");
        if (!this.isInited) {
            console.error("RewardedAdController::removeAdDelegate Controller not initialized");
            return;
        }
        this.rewardedAdDelegate = null;
        this.rewardedAd.removeAdDelegate();
    }

    loadAd(rewardAdType: string) {
        if (!this.isInited) {
            console.error("RewardedAdController::showAd Controller not initialized");
            return;
        }
        this.rewardedAd.loadAd(rewardAdType);
    }

    showAd(rewardAdType: string, initiatedFrom: string) {
        if (!this.isInited) {
            console.error("RewardedAdController::showAd Controller not initialized");
            return;
        }
        if (!this.rewardedAd.isAdLoaded(rewardAdType)) {
            this.setPendingAdHandler(rewardAdType, initiatedFrom);
        } 
        this.rewardedAd.showAd(rewardAdType, initiatedFrom);
    }

    isAdLoaded(rewardAdType: string): boolean {
        if (!this.isInited) {
            console.error("RewardedAdController::isAdLoaded Controller not initialized");
            return false;
        }
        return this.rewardedAd.isAdLoaded(rewardAdType);
    }

    isAdAvailable(rewardAdType: string): boolean {
        if (!this.isInited) {
            console.error("RewardedAdController::isAdAvailable Controller not initialized");
            return false;
        }
        return this.rewardedAd.isAdAvailable(rewardAdType);
    }

    onAdLoaded(rewardAdType: string) {
        AdsDepsContainer.getDeps().dispatchEvent(RewardedAdController.Events.AdLoaded);
        this.clearPendingAdHandler(rewardAdType);
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

    private static instance: RewardedAdController;

    private isInited = false;
    private rewardedAd: IRewardedAd;
    private rewardedAdDelegate: IRewardedAdDelegate;
    private pendingAds: Dictionary<string, PendingAdHandler> = new Dictionary();
}

export namespace RewardedAdController {
    export enum Events {
        AdLoaded = "AdLoaded",
        SetAdText = "SetAdText",
        ContinueAdWatchSuccessful = "ContinueAdWatchSuccessful",
        ContinueRewardSkipped = "ContinueRewardSkipped"
    }	
}
