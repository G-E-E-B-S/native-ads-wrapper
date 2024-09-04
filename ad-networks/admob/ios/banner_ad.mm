

#include "banner_ad.h"
#include "banner_ad_listener.h"
#import <GoogleMobileAds/GoogleMobileAds.h>

namespace wrapper {
namespace admob {

std::unique_ptr<BannerAd> BannerAd::_instance;
BannerAdListener *bannerListener = [[BannerAdListener alloc] init];

void BannerAd::onInitializeComplete() {
    auto oldState = _state;
    _state = State::kInitialized;
}

void BannerAd::onLoadComplete() {
    auto oldState = _state;
    _state = State::kLoaded;
    if (oldState == State::kShowPending) {
        this->show(_pendingPlacementToShow, _pendingPlacementToShowLocation);
    }
}


void BannerAd::stop() {
    // TODO:
}


bool BannerAd::isPlacementCapped(const std::string& placementName) {
    return false;
}

void BannerAd::registerPlacement(const std::string& placementName, const std::string& placementId) {
    placementMap.insert({placementName, placementId});
}
void BannerAd::show(const std::string& placementName, const std::string& location) {
    if (placementMap.count(placementName) == 0) {
        return;
    }
    auto adUnitId = placementMap[placementName];
    // TODO: can't find a good place for this in current implementation
    [bannerListener setListener:_listener];
    [bannerListener show: [NSString stringWithUTF8String:adUnitId.c_str()]];
}
void BannerAd::hide(const std::string& placementName) {
    [bannerListener hide];
}

bool BannerAd::isAdLoaded() {
    // TODO:
    return true;
}
bool BannerAd::isAdAvailable() {
    // TODO:
    return true;
}
void BannerAd::load(const std::string &placementName) {
    // no - op
}
}
}
