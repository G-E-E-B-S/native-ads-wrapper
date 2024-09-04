declare namespace ads {
    export interface IInterstialListener {
        onShown(): void;
        onClosed(): void;
        onLoadFailed(): void;
        onShowFailed(): void;
    }
    export class Interstitial {
        isAdAvailable(): boolean;
        load(interstitialAdType: string): void;
        show(interstitialAdType: string, initiatedFrom: string): void;
        registerPlacement(adType: string, placementId: string): void;
        setup(loadOnInit: boolean, adType: string): void;
        isAdLoaded(): boolean;
        static getInstance(): Interstitial;
    }
    export function setInterstitialListener(listener: IInterstialListener): void;
    export interface IRewardedListener {
        onAdLoaded(): void;
        onClosed(): void;
        onRewardGranted(): void;
        onShown(): void;
        onLoadFailed(): void;
        onShowFailed(): void;
        onRewardCancelled(): void;

    }
    export class RewardedVideo {
        isAdLoaded(): boolean;
        isAdAvailable(): boolean;
        load(rewardAdType: string): void;
        show(rewardAdType: string, initiatedFrom: string): void;
        registerPlacement(adType: string, placementId: string): void;
        setup(initOnLoad: boolean, adType: string): void;
        static getInstance(): RewardedVideo;
    }
    export function setRewardedListener(l: IRewardedListener): void;
    export interface IRewardedInterstitialListener {
        onAdLoaded(): void;
        onClosed(): void;
        onRewardGranted(): void;
        onShown(): void;
        onLoadFailed(): void;
        onShowFailed(): void;
        onRewardCancelled(): void;
    }
    export class RewardedInterstitialVideo {
        isAdLoaded(): boolean;
        isAdAvailable(): boolean;
        load(rewardAdType: string): void;
        show(rewardAdType: string, initiatedFrom: string): void;
        registerPlacement(adType: string, placementId: string): void;
        setup(initOnLoad: boolean, adType: string): void;
        static getInstance(): RewardedInterstitialVideo;
    }
    export function setRewardedInterstitalListener(l: IRewardedInterstitialListener): void;
    export interface IBannerListener {
        onLoaded(): void;
        onLoadFailed(): void;
        onClicked(): void;
        onScreenPresented(): void;
        onScreenDismissed(): void;
        onLeftApplication(): void;
    }
    export class BannerAd {
        show(adType: string, launchPoint: string): void;
        hide(adTypeToShow: string): void;
        registerPlacement(adType: string, placementId: string): void;
        setup(initOnLoad: boolean, adType: string): void;
        static getInstance(): BannerAd;
    }
    export function setBannerListener(l: IBannerListener): void;
}