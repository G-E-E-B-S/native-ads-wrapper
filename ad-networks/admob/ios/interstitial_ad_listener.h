
#ifndef INTERSTITIAL_AD_LISTENER_H
#define INTERSTITIAL_AD_LISTENER_H

#include "interstitial_implementation.h"
#import "ad_status.h"
#include <GoogleMobileAds/GoogleMobileAds.h>

@class RootViewController;

@interface InterstitialAdListener : NSObject <GADFullScreenContentDelegate> {
@private
    GADInterstitialAd *_interstitial;
    std::shared_ptr<InterstitalListener> _listener;
    AdStatus _adStatus;
}
@property (nonatomic, strong, nullable) GADInterstitialAd *interstitial;
- (void) setup:(NSString*_Nonnull) adUnitId listener: (std::shared_ptr<InterstitalListener>) listener;
- (void)show;

- (void)hide;
- (bool) isAdLoaded;
- (bool) isAdAvailable;

/// Tells the delegate that an impression has been recorded for the ad.
- (void)adDidRecordImpression:(nonnull id<GADFullScreenPresentingAd>)ad;

/// Tells the delegate that a click has been recorded for the ad.
- (void)adDidRecordClick:(nonnull id<GADFullScreenPresentingAd>)ad;

/// Tells the delegate that the ad failed to present full screen content.
- (void)ad:(nonnull id<GADFullScreenPresentingAd>)ad
    didFailToPresentFullScreenContentWithError:(nonnull NSError *)error;

/// Tells the delegate that the ad will present full screen content.
- (void)adWillPresentFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad;

/// Tells the delegate that the ad will dismiss full screen content.
- (void)adWillDismissFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad;

/// Tells the delegate that the ad dismissed full screen content.
- (void)adDidDismissFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad;

@end

#endif /* INTERSTITIAL_AD_LISTENER_H */
