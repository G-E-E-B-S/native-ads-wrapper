
#ifndef REWARDED_AD_LISTENER_H
#define REWARDED_AD_LISTENER_H

#import <GoogleMobileAds/GoogleMobileAds.h>
#include "rewarded_interstitial_video_implementation.h"
#include <memory>

#import "ad_status.h"

@class RootViewController;

@interface RewardedInterstialAdListener : NSObject <GADFullScreenContentDelegate> {
@private
    GADRewardedAd *_rewardedAd;
    std::shared_ptr<RewardedInterstitialVideoListener> _listener;
    AdStatus _adStatus;
    bool _rewardGranted;
}
@property (nonatomic, strong) GADRewardedAd * _Nullable rewardedAd;
- (void) load:(NSString*_Nonnull) adUnitId listener: (std::shared_ptr<RewardedInterstitialVideoListener>) listener;
- (void)show;

- (void)hide;
- (bool)isAdLoaded;
- (bool)isAdAvailable;

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

#endif /* REWARDED_AD_LISTENER_H */
