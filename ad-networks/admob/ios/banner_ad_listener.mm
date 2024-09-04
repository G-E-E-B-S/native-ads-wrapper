#import "banner_ad_listener.h"

@implementation BannerAdListener
- (void) setListener: (std::shared_ptr<BannerListener>) listener {
    _listener = listener;
}
- (void)show: (NSString*_Nonnull) adUnitId {
    if (self.bannerView != nil) {
        return;
    }
    //    adUnitId = @"ca-app-pub-3940256099942544/2934735716";
    self.bannerView = [[GADBannerView alloc] initWithAdSize:GADAdSizeBanner];
    self.bannerView.translatesAutoresizingMaskIntoConstraints = NO;
    self.bannerView.adUnitID = adUnitId;
    self.bannerView.rootViewController = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    self.bannerView.delegate = self;
    [self.bannerView loadRequest:[GADRequest request]];
}
- (void)hide {
    if (self.bannerView != nil) {
        [self.bannerView  setRootViewController:nil];
        [self.bannerView  removeFromSuperview];
        self.bannerView  = nil;
    }
}
- (void)bannerViewDidReceiveAd:(GADBannerView *)bannerView {
    _listener->onLoaded();
  NSLog(@"bannerViewDidReceiveAd");
    auto controller = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [controller.view addSubview:self.bannerView];
    [controller.view addConstraints:@[
        [NSLayoutConstraint constraintWithItem:self.bannerView
                                     attribute:NSLayoutAttributeBottom
                                     relatedBy:NSLayoutRelationEqual
                                        toItem: controller.bottomLayoutGuide
                                     attribute:NSLayoutAttributeTop
                                    multiplier:1
                                      constant:0],
        [NSLayoutConstraint constraintWithItem:self.bannerView
                                     attribute:NSLayoutAttributeCenterX
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:controller.view
                                     attribute:NSLayoutAttributeCenterX
                                    multiplier:1
                                      constant:0]
    ]];
}

- (void)bannerView:(GADBannerView *)bannerView didFailToReceiveAdWithError:(NSError *)error {
  NSLog(@"bannerView:didFailToReceiveAdWithError: %@", [error localizedDescription]);
    _listener->onLoadFailed();
}
- (void)bannerViewDidRecordClick:(nonnull GADBannerView *)bannerView {
    NSLog(@"bannerViewDidRecordClick");
    _listener->onClicked();
}
- (void)bannerViewDidRecordImpression:(GADBannerView *)bannerView {
  NSLog(@"bannerViewDidRecordImpression");
}

- (void)bannerViewWillPresentScreen:(GADBannerView *)bannerView {
  NSLog(@"bannerViewWillPresentScreen");
  _listener->onScreenPresented();
}

- (void)bannerViewWillDismissScreen:(GADBannerView *)bannerView {
  NSLog(@"bannerViewWillDismissScreen");
}

- (void)bannerViewDidDismissScreen:(GADBannerView *)bannerView {
  NSLog(@"bannerViewDidDismissScreen");
    _listener->onScreenDismissed();
}
@end
