#include "interstitial_ad.h"
#include "interstitial_ad_listener.h"
namespace wrapper {
    namespace admob {
        std::unique_ptr<InterstitialAd> InterstitialAd::_instance;
        InterstitialAdListener *interstitialListener = [[InterstitialAdListener alloc] init];
        void InterstitialAd::registerPlacement(const std::string& placementName, const std::string& placementId) {
            placementMap.insert({placementName, placementId});
        }
        void InterstitialAd::stop() {
            // TODO:
        }
        void InterstitialAd::load(const std::string& placementName) {
            if (placementMap.count(placementName) == 0) {
                return;
            }
            auto adUnit = [NSString stringWithUTF8String:placementMap[placementName].c_str()];
            [interstitialListener setup:adUnit listener:_listener];
        }
        bool InterstitialAd::isAdLoaded() {
            return [interstitialListener isAdLoaded];
        }
        bool InterstitialAd::isAdAvailable() {
            return [interstitialListener isAdAvailable];
        }
        void InterstitialAd::show(const std::string& placementName, const std::string& location) {
            [interstitialListener show];
        }
        bool InterstitialAd::isPlacementCapped(const std::string& placementName) {
            // TODO:
            return false;
        }
    }
}
