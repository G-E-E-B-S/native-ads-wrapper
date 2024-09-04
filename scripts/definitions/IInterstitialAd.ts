export interface IInterstitialAdDelegate {
	onAdShown();
	onAdShowFailed();
	onAdLoaded(interstitialAdType: string, attemptTaken: number);
    onAdLoadFailed(interstitialAdType: string,error: string, attemptTaken: number);
}

export interface IInterstitialAd {
	isSupported(): boolean;
	isAdLoaded(interstitialAdType: string): boolean;
	isAdAvailable(interstitialAdType: string): boolean;
	loadAd(interstitialAdType: string);
	showAd(interstitialAdType: string, initiatedFrom: string);
	getAdPlacementID(interstitialAdType: string): string;
	setAdDelegate(adDelegate: IInterstitialAdDelegate);
}
