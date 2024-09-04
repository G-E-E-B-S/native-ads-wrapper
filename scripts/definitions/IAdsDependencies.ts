import { AdPlacementsData } from "./AdDefinitions";

type EventParams = { [index: string]: number | string };

export interface IAdsDependencies {
    /**
     * ad loading wait timeout in milli sec
     */
    getAdLoadWaitTimeout(): number;

    /**Returns the maximum number of retries can be done while ad is failed to load. This will apply only for native ads.
     * @returns number
     */
    getMaxAdLoadRetryAttempts(): number;

    /**Used to set the ad load retry time intervals in milliseconds. This will apply only for native ads.
     * If you don't want configure this, return []. As a fallback, the default value will be used.
     * The last element of the array will be used as the retry time interval for all the subsequent retries.
     * @returns number[]
     */
    getAdLoadRetryTimeIntervals(): number[];

    getInterstitialAdsPlacementMap(): AdPlacementsData;
    getBannerAdsPlacementMap(): AdPlacementsData;
    getRewardedAdsPlacementMap(): AdPlacementsData;
    getRewardedInterstitialAdsPlacementMap(): AdPlacementsData;
    isErrorIgnored(apiName: string): boolean;
    canShowBannerAd(): boolean;
    logAnalyticsEvent(eventName: string, params?: EventParams);
    logAnalyticsEventWithCount(count: number, name: string, params?: EventParams);
    logError(errorStr: string, errObj?);
    dispatchEvent(eventName: string, eventData?);
}
