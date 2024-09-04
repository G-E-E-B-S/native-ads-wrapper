import { IBannerAdListener } from "./IBannerAdListener";

export interface IBannerAd {
    setListener(listener: IBannerAdListener);
    isShowing(): boolean;
    showAd(adType: string, launchPoint: string): void;
    hideAd(): void;
    getRateLimitMs(): number;
    getPlacementId(adType: string): string;
}
