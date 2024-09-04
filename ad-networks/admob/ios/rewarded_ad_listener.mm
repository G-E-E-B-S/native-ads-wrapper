#import "rewarded_ad_listener.h"

@implementation RewardedAdListener
- (id)init {
    self = [super init];

    if (self) {
        _adStatus = AdStatusCreated;
    }

    return self;
}
- (void)load:(NSString *)adUnitId listener: (std::shared_ptr<RewardedVideoListener>) listener {
    _adStatus = AdStatusLoading;
    _listener = listener;
    GADRequest *request = [GADRequest request];
    [GADRewardedAd
     loadWithAdUnitID:adUnitId
     request:request
     completionHandler:^(GADRewardedAd *ad, NSError *error) {
        if (error) {
            self->_adStatus = AdStatusNotLoaded;
            NSLog(@"Rewarded ad failed to load with error: %@", [error localizedDescription]);
            self->_listener->onLoadFailed();
            return;
        }
        self->_listener->onAdLoaded();
        self->_adStatus = AdStatusLoaded;
        self.rewardedAd = ad;
        self.rewardedAd.fullScreenContentDelegate = self;
        NSLog(@"Rewarded ad loaded.");
    }];
}
- (void)show {
    if (self.rewardedAd) {
        _adStatus = AdStatusShowing;
        [self.rewardedAd presentFromRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController
                                userDidEarnRewardHandler:^{
            NSLog(@"reward granted!");
            self->_rewardGranted = true;
            self->_listener->onRewardGranted();
        }];
    } else {
        NSLog(@"Ad wasn't ready");
    }
}
- (void)hide {
    // TODO:
}

/// Tells the delegate that an impression has been recorded for the ad.
- (void)adDidRecordImpression:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adDidRecordImpression");
}

/// Tells the delegate that a click has been recorded for the ad.
- (void)adDidRecordClick:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adDidRecordClick");
}

/// Tells the delegate that the ad failed to present full screen content.
- (void)ad:(nonnull id<GADFullScreenPresentingAd>)ad
didFailToPresentFullScreenContentWithError:(nonnull NSError *)error {
    NSLog(@"didFailToPresentFullScreenContentWithError: %@", [error localizedDescription]);
    self.rewardedAd = nil;
    _adStatus = AdStatusNotAvailable;
    _listener->onShowFailed();
}
/// Tells the delegate that the ad will present full screen content.
- (void)adWillPresentFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adWillPresentFullScreenContent");
    _listener->onShown();
}
/// Tells the delegate that the ad will dismiss full screen content.
- (void)adWillDismissFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adWillDismissFullScreenContent");
}
/// Tells the delegate that the ad dismissed full screen content.
- (void)adDidDismissFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adDidDismissFullScreenContent");
    NSString* adUnitId = [self.rewardedAd.adUnitID copy];
    self.rewardedAd = nil;
    _adStatus = AdStatusNotAvailable;
    _listener->onClosed();
    if (!_rewardGranted) {
        _listener->onRewardCancelled();
    } else {
        // reset for next reward
        _rewardGranted = false;
    }
    [self load:adUnitId listener:_listener];
}
- (bool)isAdLoaded {
    return  _adStatus == AdStatusLoaded;
}
- (bool)isAdAvailable {
    return  _adStatus == AdStatusLoaded || _adStatus == AdStatusLoading;
}
@end
