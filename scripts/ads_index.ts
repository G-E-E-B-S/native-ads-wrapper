import { BannerAdController } from "./controllers/BannerAdController";
import { InterstitialAdController } from "./controllers/InterstitialAdController";
import { RewardedAdController } from "./controllers/RewardedAdController";
import { RewardedInterstitialAdController } from "./controllers/RewardedInterstitialAdController";
import { AdsDepsContainer } from "./definitions/AdsDepsContainer";
import { IAdsDependencies } from "./definitions/IAdsDependencies";
import { IBannerAd } from "./definitions/IBannerAd";
import { IInterstitialAd } from "./definitions/IInterstitialAd";
import { IRewardedAd } from "./definitions/IRewardedAd";
import { IRewardedInterstitialAd } from "./definitions/IRewardedInterstitial";
import { BannerAdInstant } from "./instant-games/BannerAdInstant";
import { InterstitialAdInstant } from "./instant-games/InterstitialAdInstant";
import { RewardedAdInstant } from "./instant-games/RewardedAdInstant";
import { RewardedInterstitialAdInstant } from "./instant-games/RewardedInterstitialAdInstant";
import { NativeBannerAd } from "./native/NativeBannerAd";
import { NativeInterstitialAd } from "./native/NativeInterstitialAd";
import { NativeRewardedAd } from "./native/NativeRewardedAd";
import { NativeRewardedInterstitialAd } from "./native/NativeRewardedInterstitialAd";
import { BannerAdEmpty } from "./web/BannerAdEmpty";
import { WebInterstitialAd } from "./web/WebInterstitialAd";
import { WebRewardedAd } from "./web/WebRewardedAd";
import { WebRewardedInterstitialAd } from "./web/WebRewardedInterstitialAd";


export class AdsPackageIniter {
    static initForInstantGames(externalDeps: IAdsDependencies) {
        this.init(
            externalDeps,
            new RewardedAdInstant(externalDeps),
            new InterstitialAdInstant(externalDeps),
            new BannerAdInstant(externalDeps),
            new RewardedInterstitialAdInstant(externalDeps)
        );
    }

    static initForNative(externalDeps: IAdsDependencies) {
        this.init(
            externalDeps,
            new NativeRewardedAd(externalDeps),
            new NativeInterstitialAd(externalDeps),
            new NativeBannerAd(externalDeps),
            new NativeRewardedInterstitialAd(externalDeps)
        );
    }
    static initForWeb(externalDeps: IAdsDependencies) {
        this.init(
            externalDeps,
            new WebRewardedAd(externalDeps),
            new WebInterstitialAd(externalDeps),
            new BannerAdEmpty(),
            new WebRewardedInterstitialAd(),
        );
    }

    private static init(
        externalDeps: IAdsDependencies,
        rewardedAd: IRewardedAd,
        interstitialAd: IInterstitialAd,
        bannerAd: IBannerAd,
        rewardedInterstitial: IRewardedInterstitialAd) {
        if (!AdsPackageIniter.canInit(externalDeps)) {
            return;
        }
        AdsDepsContainer.setDeps(externalDeps);
        InterstitialAdController.getInstance().init(interstitialAd);
        RewardedAdController.getInstance().init(rewardedAd);
        RewardedInterstitialAdController.getInstance().init(rewardedInterstitial);
        BannerAdController.init(bannerAd);
        AdsPackageIniter.inited = true;
    }
    private static canInit(externalDeps: IAdsDependencies): boolean {
        if (AdsPackageIniter.inited) {
            console.error("Ads package already inited");
            return false;
        }
        if (!externalDeps) {
            console.error("IAdsDependencies interface need to be implemented for Ads package to work");
            return false;
        }
        return true;
    }

    static isInited(): boolean {
        return AdsPackageIniter.inited;
    }

    private static inited: boolean = false;
}
