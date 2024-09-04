import { IAdsDependencies } from "../definitions/IAdsDependencies";

export abstract class NativeOnDemandAdUnit {
    constructor(dependency: IAdsDependencies) {
        this.dependency = dependency;
    }

    loadAd(adType: string) {
        this.resetAdLoadRetryAttempt();
        this.attemptToLoadAd(adType);
    }

    protected resetAdLoadRetryAttempt() {
        this.adLoadRetryAttempt = 0;
    }

    protected handleAdLoadFailure(adType: string) {
        if (this.adLoadRetryAttempt < this.dependency.getMaxAdLoadRetryAttempts()) {
            this.adLoadRetryAttempt++;
            const coolDownTime = this.getCooldownTimeForCurrentAdLoadRetryAttempt();
            console.log(`${this.TAG}: Cool down time of ${coolDownTime} milliseconds started to ad load attempt ${this.adLoadRetryAttempt}.`);

            setTimeout(() => {
                console.log(`${this.TAG}: Started ${this.adLoadRetryAttempt} attempt to load the ad.`);
                this.attemptToLoadAd(adType);
            }, coolDownTime);
        } else {
            console.log(this.TAG + ": Reached max ad load retry attempts.");
        }
    }

    /** Returns the cooldown time for the current ad load retry attempt in milliseconds.
     * @returns number
     */
    private getCooldownTimeForCurrentAdLoadRetryAttempt(): number {
        let retryIntervals = this.dependency.getAdLoadRetryTimeIntervals();
        if (retryIntervals.length < 1) {
            retryIntervals = this.defaultAdLoadRetryIntervalsInMs;
        }

        if (this.adLoadRetryAttempt > retryIntervals.length) {
            return retryIntervals[retryIntervals.length - 1];
        } else {
            return retryIntervals[this.adLoadRetryAttempt - 1];
        }
    }


    /** This method will attempt to load the ad.
      * @param  {string} adType
      */
    protected abstract attemptToLoadAd(adType: string): void;
    protected abstract TAG: string;

    protected dependency: IAdsDependencies;
    protected adLoadRetryAttempt = 0;
    private defaultAdLoadRetryIntervalsInMs = [10000, 30000, 60000];
}