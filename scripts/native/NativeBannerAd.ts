import { Dictionary } from "typescript-collections";
import { AdAnalyticsEvents } from "../definitions/AdDefinitions";
import { IAdsDependencies } from "../definitions/IAdsDependencies";
import { IBannerAd } from "../definitions/IBannerAd";
import { IBannerAdListener } from "../definitions/IBannerAdListener";

// TODO: right now banner only supports single default placement.
// fix this and add multi placement support along with default.
export class NativeBannerAd implements IBannerAd {
    constructor(dependency: IAdsDependencies) {
        this.dependency = dependency;
        this.initListener();
        this.initPlacements();
    }

    getPlacementId(adType: string): string {
        if (this.placementIdMap.containsKey(adType)) {
            return this.placementIdMap.getValue(adType);
        }
        console.error("No placement found returning empty");
        return "";
    }

    setListener(listener: IBannerAdListener) {
        this.listener = listener;
    }

    isShowing(): boolean {
        // Banner zone needs to be kept clean on native, its always ready to show.
        return true;
    }

    showAd(adType: string, launchPoint: string): void {
        this.launchPoint = launchPoint;
        this.adTypeToShow = adType;
        ads.BannerAd.getInstance().show(adType, launchPoint);
    }

    hideAd(): void {
        ads.BannerAd.getInstance().hide(this.adTypeToShow);
    }

    getRateLimitMs(): number {
        return 0;
    }

    private initPlacements() {
        const deps = this.dependency;
        const placementsData = deps.getBannerAdsPlacementMap();
        const bannerAds = ads.BannerAd.getInstance();
        for (const adType in placementsData) {
            const placementId = placementsData[adType];
            this.placementIdMap.setValue(adType, placementId);
            bannerAds.registerPlacement(adType, placementId);
        }
    }
    private initListener() {
        const deps = this.dependency;
        const listener: ads.IBannerListener = {
            onLoaded: () => {
                console.log("NativeBannerAd::onLoaded");
            },
            onLoadFailed: () => {
                console.log("NativeBannerAd::onLoadFailed");
                deps.logAnalyticsEvent("banner_error", {
                    // TODO: add error code
                    kingdom: "NA",
                });
            },
            onClicked: () => {
                console.log("NativeBannerAd::onClicked");
            },
            onScreenPresented: () => {
                console.log("NativeBannerAd::onScreenPresented");
                deps.logAnalyticsEvent(AdAnalyticsEvents.AdImpression, {
                    "kingdom": "banner",
                    "phylum": this.getPlacementId(this.adTypeToShow),
                    "class": this.launchPoint,
                });
                if (this.listener) {
                    this.listener.onAdShown(this.getPlacementId(this.adTypeToShow), this.launchPoint);
                }
            },
            onScreenDismissed: () => {
                console.log("NativeBannerAd::onScreenDismissed");
            },
            onLeftApplication: () => {
                console.log("NativeBannerAd::onLeftApplication");
            }
        }
        ads.setBannerListener(listener);
    }
    private dependency: IAdsDependencies;
    private launchPoint: string;
    private listener: IBannerAdListener;
    private adTypeToShow: string;
    private placementIdMap: Dictionary<string, string> = new Dictionary();
    // Need to hold native object, else callbacks don't work
}
