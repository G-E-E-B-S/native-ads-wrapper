import { AdsDepsContainer } from "../definitions/AdsDepsContainer";
import { IBannerAd } from "../definitions/IBannerAd";
import { IBannerAdListener } from "../definitions/IBannerAdListener";

export class BannerAdController implements IBannerAdListener {
    static TAG = "BannerAdController";

    onAdShown(placementId: string, launchPoint: string) {
        console.log("onAdShown pid: %s, lp: %s", placementId, launchPoint);
    }

    static init(controller: IBannerAd) {
        if (BannerAdController.bannerAd) {
            return;
        }

        BannerAdController.bannerAd = controller;
        BannerAdController.bannerAd.setListener(this.getInstance());
    }

    static getAdImplementation(): IBannerAd {
        return BannerAdController.bannerAd;
    }

    private static canShowAd(): boolean {
        return AdsDepsContainer.getDeps().canShowBannerAd();
    }

    static showAd(adType: string, launchPoint: string): void {
        console.log(this.TAG + " - showAd | " + launchPoint);

        if (!BannerAdController.bannerAd) {
            return;
        }
        if (!BannerAdController.hidden) {
            return;
        }
        if (!BannerAdController.canShowAd()) {
            console.log(this.TAG + " - Cannot show Banner Ad!");
            return;
        }

        if (!launchPoint) {
            console.log(this.TAG + " - Cannot show Banner Ad! Invalid launchPoint");
            return;
        }
        AdsDepsContainer.getDeps().logAnalyticsEvent("ad_initiate", {
            "kingdom": "banner",
            "phylum": BannerAdController.bannerAd.getPlacementId(adType),
            "class": launchPoint
        });

        clearTimeout(BannerAdController.pendingShowTimeoutHandler);
        const lastAdReqElapsedMs = Date.now() - BannerAdController.lastAdRequestMs;
        const rateLimitMs = BannerAdController.bannerAd.getRateLimitMs();
        if (lastAdReqElapsedMs < rateLimitMs) {
            BannerAdController.pendingShowTimeoutHandler = setTimeout(() => {
                BannerAdController.showAd(adType, launchPoint)
            }, rateLimitMs - lastAdReqElapsedMs);
            return;
        }

        BannerAdController.lastAdRequestMs = Date.now();
        BannerAdController.lastLaunchPoint = launchPoint;
        BannerAdController.hidden = false;
        BannerAdController.bannerAd.showAd(adType, launchPoint);
    }

    static getLastLaunchPoint(): string {
        return BannerAdController.lastLaunchPoint;
    }

    static hideAd() {
        console.log(this.TAG + " - hideAd");
        clearTimeout(BannerAdController.pendingShowTimeoutHandler);
        if (!BannerAdController.bannerAd) {
            return;
        }
        if (BannerAdController.hidden) {
            return;
        }
        BannerAdController.hidden = true;
        BannerAdController.lastAdRequestMs = Date.now();
        BannerAdController.bannerAd.hideAd();
    }

    static isShowingAd(): boolean {
        if (!BannerAdController.bannerAd) {
            return false;
        }
        return BannerAdController.bannerAd.isShowing();
    }

    private static getInstance() {
        if (!this.instance) {
            this.instance = new BannerAdController();
        }
        return this.instance;
    }

    private static instance: BannerAdController;
    private static bannerAd: IBannerAd;
    private static lastLaunchPoint: string;
    private static lastAdRequestMs = 0;
    private static pendingShowTimeoutHandler;
    private static hidden = true;
}
