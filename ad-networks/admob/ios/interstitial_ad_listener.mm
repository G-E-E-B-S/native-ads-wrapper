#import "interstitial_ad_listener.h"

@implementation InterstitialAdListener
- (id)init {
    self = [super init];

    if (self) {
        _adStatus = AdStatusCreated;
    }
    return self;
}
- (void)setup:(NSString *)adUnitId listener: (std::shared_ptr<InterstitalListener>)listener {
    _adStatus = AdStatusLoading;
    _listener = (listener);
    GADRequest *request = [GADRequest request];
    [GADInterstitialAd loadWithAdUnitID:adUnitId
                                request:request
                      completionHandler:^(GADInterstitialAd *ad, NSError *error) {
        if (error) {
            NSLog(@"Failed to load interstitial ad with error: %@", [error localizedDescription]);
            self->_adStatus = AdStatusNotLoaded;
            self->_listener->onLoadFailed();
            return;
        }
        self->_adStatus = AdStatusLoaded;
        self.interstitial = ad;
        self.interstitial.fullScreenContentDelegate = self;
    }];
}

- (void)show {
    if (self.interstitial) {
        _adStatus = AdStatusShowing;
        [self.interstitial presentFromRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
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
    _listener->onShown();
}

/// Tells the delegate that a click has been recorded for the ad.
- (void)adDidRecordClick:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adDidRecordClick");
}

/// Tells the delegate that the ad failed to present full screen content.
- (void)ad:(nonnull id<GADFullScreenPresentingAd>)ad
didFailToPresentFullScreenContentWithError:(nonnull NSError *)error {
    NSLog(@"didFailToPresentFullScreenContentWithError: %@", [error localizedDescription]);
    self.interstitial = nil;
    _adStatus = AdStatusNotAvailable;
    _listener->onShowFailed();
}

/// Tells the delegate that the ad will present full screen content.
- (void)adWillPresentFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adWillPresentFullScreenContent");
}

/// Tells the delegate that the ad will dismiss full screen content.
- (void)adWillDismissFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adWillDismissFullScreenContent");
}

/// Tells the delegate that the ad dismissed full screen content.
- (void)adDidDismissFullScreenContent:(nonnull id<GADFullScreenPresentingAd>)ad {
    NSLog(@"adDidDismissFullScreenContent");
    NSString* adUnitId = [self.interstitial.adUnitID copy];
    self.interstitial = nil;
    _adStatus = AdStatusNotAvailable;
    _listener->onClosed();
    [self setup:adUnitId listener:_listener];
}
- (bool)isAdLoaded {
    return  _adStatus == AdStatusLoaded;
}
- (bool)isAdAvailable {
    return  _adStatus == AdStatusLoaded || _adStatus == AdStatusLoading;
}

@end
