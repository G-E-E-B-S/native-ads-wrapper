import { IBannerAd } from "../definitions/IBannerAd";
import { IBannerAdListener } from "../definitions/IBannerAdListener";


export class BannerAdEmpty implements IBannerAd {
    isShowing(): boolean {
        return false;
    }

    setListener(listener: IBannerAdListener) {
        
    }

    showAd(adType: string, launchPoint: string): void {
        
    }

    hideAd(): void {
        
    }

    getRateLimitMs(): number {
        return 0;
    }
    getPlacementId(): string {
        return "";
    }
}

