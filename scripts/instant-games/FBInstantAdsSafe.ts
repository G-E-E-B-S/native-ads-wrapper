import { AdsDepsContainer } from "../definitions/AdsDepsContainer";

let FBInstantSupportedAPIs = [];

if (typeof FBInstant != 'undefined') {
    FBInstantSupportedAPIs = FBInstant.getSupportedAPIs();
}

export class FBInstantAdsSafe {
    static isAvailable() {
        return typeof FBInstant != 'undefined';
    }

    static isApiSupported(apiStr: string): boolean {
        if (!FBInstantAdsSafe.isAvailable()) {
            return false;
        }

        if (FBInstantAdsSafe.apiErrorLoggedList[apiStr]) {
            return false;
        }

        const isSupported = FBInstantAdsSafe.isFBInstantApiSupported(apiStr);
        if (!isSupported) {
            if (!AdsDepsContainer.getDeps().isErrorIgnored(apiStr) && !FBInstantAdsSafe.apiErrorLoggedList[apiStr]) {
                AdsDepsContainer.getDeps().logError("Instant Api not supported:" + apiStr);   
                FBInstantAdsSafe.apiErrorLoggedList[apiStr] = true;
            }
        }
        return isSupported;
    }

    static getRewardedVideoAsync(placementID: string): Promise<FBInstant.AdInstance> {
        if (!FBInstantAdsSafe.isApiSupported("getRewardedVideoAsync")) {
            return Promise.reject("Api not supported");
        }

        try {
            return FBInstant.getRewardedVideoAsync(placementID);
        } catch (e) {
            return Promise.reject("Api error");
        }
    }

    static getRewardedInterstitialAsync(placementID: string): Promise<FBInstant.AdInstance> {
        if (!FBInstantAdsSafe.isApiSupported("getRewardedVideoAsync")) {
            return Promise.reject("Api not supported");
        }

        try {
            //@ts-ignore
            return FBInstant.getRewardedInterstitialAsync(placementID);
        } catch (e) {
            return Promise.reject("Api error");
        }
    }

    static getInterstitialAdAsync(placementID: string): Promise<FBInstant.AdInstance> {
        if (!FBInstantAdsSafe.isApiSupported("getInterstitialAdAsync")) {
            return Promise.reject("Api not supported");
        }

        try {
            return FBInstant.getInterstitialAdAsync(placementID);
        } catch (e) {
            return Promise.reject("Api error");
        }
    }

    static loadBannerAdAsync(placementId: string): Promise<void> {
        if (!FBInstantAdsSafe.isApiSupported("loadBannerAdAsync")) {
            return Promise.reject("Api not supported");
        }

        try {
            // @ts-ignore
            return FBInstant.loadBannerAdAsync(placementId);
        } catch (e) {
            return Promise.reject("Api error");
        }
    }

    static hideBannerAdAsync(): Promise<void> {
        if (!FBInstantAdsSafe.isApiSupported("hideBannerAdAsync")) {
            return Promise.reject("Api not supported");
        }

        try {
            // @ts-ignore
            return FBInstant.hideBannerAdAsync();
        } catch (e) {
            return Promise.reject("Api error");
        }
    }
    private static isFBInstantApiSupported(apiStr: string): boolean {
        return FBInstantSupportedAPIs.indexOf(apiStr) > -1;
    }
    

    private static apiErrorLoggedList: {[apiStr: string]: boolean} = {};
}
