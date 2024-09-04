import { FBApiError } from "./AdDefinitions";

export interface IAdCollectionDelegate {
    onAdLoadFailed(placementId: string, error: string);

	onAdLoaded(placementId: string): void;

	onAdShown(placementId: string, initiatedFrom: string);

	onAdShowFailed(placementId:string,  err: FBApiError);

	onAdShowStarted(placementId: string);
}
