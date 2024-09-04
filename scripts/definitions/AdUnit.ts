import { FBInstantAdsSafe } from "../instant-games/FBInstantAdsSafe";
import { AdAnalyticsEvents, AdStatus, AdType, FBApiError, FBApiErrorCode } from "./AdDefinitions";
import { IAdCollectionDelegate } from "./IAdCollectionDelegate";
import { IAdsDependencies } from "./IAdsDependencies";

const MaxRetry = 3;
const RetryTimeout = 30000;
export class AdUnit {
    constructor(placementId: string, delegate: IAdCollectionDelegate, adType: AdType, dependency: IAdsDependencies) {
        this.placementId = placementId;
        this.delegate = delegate;
        this.adType = adType;
        this.dependency = dependency;
    }

    /** Fetches  ad and initializes.
    */
    private createAdInstance() {
        this.adUnitCurrentStatus = AdStatus.Creating;

        switch (this.adType) {
            case AdType.Rewarded:
                FBInstantAdsSafe.getRewardedVideoAsync(this.placementId).then(instance => {
                    this.initAdInstance(instance);
                }).catch(() => this.onAdCreationFailed);
                break;
            case AdType.RewardedInterstitial:
                FBInstantAdsSafe.getRewardedInterstitialAsync(this.placementId).then(instance => {
                    this.initAdInstance(instance);
                }).catch(() => this.onAdCreationFailed);
                break;
            case AdType.Interstitial:
                FBInstantAdsSafe.getInterstitialAdAsync(this.placementId).then(instance => {
                    this.initAdInstance(instance);
                }).catch(() => this.onAdCreationFailed);
                break;
        }
    }

    private isAdLoaded(): boolean {
        return this.adUnitCurrentStatus === AdStatus.Loaded;
    }

    protected isAdLoading(): boolean {
        return this.adUnitCurrentStatus === AdStatus.Loading;
    }

    protected isAdCreated(): boolean {
        return this.adUnit != null ? true : false;
    }

    /** Displays the currently loaded ads to the user.
     */
    protected displayAd() {
        this.waitingToShow = false;
        this.delegate.onAdShowStarted(this.placementId);
        this.adUnitCurrentStatus = AdStatus.Showing;

        this.adUnit.showAsync()
            .then(() => {
                this.onAdClosed();
                this.delegate.onAdShown(this.placementId, this.initiatedFrom);
            }).catch((err: FBApiError) => {
                this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdShowFailure, {
                    "kingdom": this.getType(),
                    "phylum": err && err.code ? err.code : "unknown",
                    "class": this.initiatedFrom,
                    "family": this.placementId
                });
                this.onAdClosed();
                this.delegate.onAdShowFailed(this.placementId, err);
            });
    }


    /** Clears the current ad unit. 
     * @returns void
     */
    protected flushAdUnit(): void {
        this.adUnit = null;
        this.adUnitCurrentStatus = AdStatus.NotAvailable;
    }

    private handleAdLoadException(err) {
        this.adUnitCurrentStatus = AdStatus.NotLoaded;
        this.logAdLoadFailure(err);
        if (err && err.code == "ADS_NO_FILL") {
            this.handleAdsNoFill("ADS_NO_FILL");
        }
    }

    private handleAdsNoFill(error: string) {
        if (this.adRetryCount < MaxRetry) {
            this.adRetryCount++;
            setTimeout(() => {
                this.loadAd();
            }, RetryTimeout);
        } else {
            this.delegate.onAdLoadFailed(this.placementId, error);
        }
    }


    /** Initialize ad unit fetched from FB Api.
     * @param  {FBInstant.AdInstance} adUnitInstance
     */
    protected initAdInstance(adUnitInstance: FBInstant.AdInstance) {
        console.log(`onInstanceCreated ad instance fetched PID: ${this.placementId}`);
        this.adUnit = adUnitInstance;
        this.adUnitCurrentStatus = AdStatus.Created;
        this.adRetryCount = 0;
        if (this.waitingToLoad) {
            this.waitingToLoad = false;
            this.loadAd();
        }
    }

    private logAdLoadFailure(err) {
        console.log(`Failed to load ad E: ${JSON.stringify(err)} pid: ${this.placementId}`);
        if (err) { // && err.code != "ADS_NO_FILL") {
            this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdLoadFailure, {
                "kingdom": this.getType(),
                "phylum": err && err.code ? err.code : "unknown",
                "class": this.placementId
            });
        }
    }

    private getType(): string {
        return this.adType;
    }

    getAdStatus(): AdStatus {
        return this.adUnitCurrentStatus
    }

    /**  Load the Ad asynchronously
     * @returns void
     */
    loadAd(): void {
        if (this.isAdLoaded() || this.adUnitCurrentStatus == AdStatus.Loading) {
            return;
        }
        if (this.adUnitCurrentStatus == AdStatus.NotAvailable) {
            this.waitingToLoad = true;
            this.createAdInstance();
            return;
        }
        if (this.adUnitCurrentStatus == AdStatus.Creating) {
            this.waitingToLoad = true;
            return;
        }
        this.waitingToLoad = false;
        this.adUnitCurrentStatus = AdStatus.Loading;
        this.adUnit.loadAsync()
            .then(() => {
                console.log(`Loaded ad ${this.placementId}`);
                this.adUnitCurrentStatus = AdStatus.Loaded;
                this.delegate.onAdLoaded(this.placementId);
                if (this.waitingToShow) {
                    this.waitingToShow = false;
                    this.displayAd();
                }
            }).catch((err) => {
                this.waitingToShow = false;
                this.handleAdLoadException(err);
            });
    }

    showAd(initiatedFrom: string): void {
        this.initiatedFrom = initiatedFrom;
        if (this.isAdLoaded()) {
            this.displayAd();
        } else {
            if (this.isAdLoading() || this.adUnitCurrentStatus == AdStatus.Creating) {
                this.waitingToShow = true;
                return;
            }
            this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdShowFailure, {
                "kingdom": this.getType(),
                "phylum": "SHOW_BEFORE_LOAD",
                "class": initiatedFrom,
                "family": this.placementId
            });
            this.delegate.onAdShowFailed(this.placementId, {
                code: FBApiErrorCode.ADS_NOT_LOADED, message: ""
            });
        }
    }

    onAdClosed() {
        console.log(" - onAdClosed");
        this.flushAdUnit();
    }

    private onAdCreationFailed(err) {
        this.adUnitCurrentStatus = AdStatus.NotAvailable;
        console.log(`Failed to create ads: ${JSON.stringify(err)} pid: ${this.placementId}`);
        this.dependency.logAnalyticsEvent(AdAnalyticsEvents.AdCreateFailure, {
            "kingdom": this.getType(),
            "phylum": err && err.code ? err.code : "unknown",
            "class": this.placementId
        });
    }

    getPlacementID = (): string => this.placementId;

    getAdLoadRetryCount = (): number => this.adRetryCount;

    private dependency: IAdsDependencies;
    private adType: AdType;
    private placementId: string;

    private adUnit: FBInstant.AdInstance = null;
    private delegate: IAdCollectionDelegate = null;
    private adUnitCurrentStatus: AdStatus = AdStatus.NotAvailable;

    private adRetryCount = 0;
    private waitingToShow = false;
    private waitingToLoad = false;
    private initiatedFrom: string;
}
