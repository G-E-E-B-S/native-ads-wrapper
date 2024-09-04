
#ifndef BANNER_AD_LISTENER_H
#define BANNER_AD_LISTENER_H

#include <GoogleMobileAds/GoogleMobileAds.h>
#include "banner_implementation.h"
#import "ad_status.h"

@class RootViewController;

@interface BannerAdListener : NSObject <GADBannerViewDelegate> {
@private
    GADBannerView *_bannerView;
    std::shared_ptr<BannerListener> _listener;
    NSString *_adUnitId;
    AdStatus _adStatus;
}
@property (nonatomic, strong) GADBannerView * _Nullable bannerView;
- (void) setListener: (std::shared_ptr<BannerListener>) listener;
- (void)show:(NSString*_Nonnull) adUnitId;

- (void)hide;

/// Tells the delegate that an ad request successfully received an ad. The delegate may want to add
/// the banner view to the view hierarchy if it hasn't been added yet.
- (void)bannerViewDidReceiveAd:(nonnull GADBannerView *)bannerView;

/// Tells the delegate that an ad request failed. The failure is normally due to network
/// connectivity or ad availablility (i.e., no fill).
- (void)bannerView:(nonnull GADBannerView *)bannerView
    didFailToReceiveAdWithError:(nonnull NSError *)error;

/// Tells the delegate that an impression has been recorded for an ad.
- (void)bannerViewDidRecordImpression:(nonnull GADBannerView *)bannerView;

/// Tells the delegate that a click has been recorded for the ad.
- (void)bannerViewDidRecordClick:(nonnull GADBannerView *)bannerView;


/// Tells the delegate that a full screen view will be presented in response to the user clicking on
/// an ad. The delegate may want to pause animations and time sensitive interactions.
- (void)bannerViewWillPresentScreen:(nonnull GADBannerView *)bannerView;

/// Tells the delegate that the full screen view will be dismissed.
- (void)bannerViewWillDismissScreen:(nonnull GADBannerView *)bannerView;

/// Tells the delegate that the full screen view has been dismissed. The delegate should restart
/// anything paused while handling bannerViewWillPresentScreen:.
- (void)bannerViewDidDismissScreen:(nonnull GADBannerView *)bannerView;

@end

#endif /* BANNER_AD_LISTENER_H */
