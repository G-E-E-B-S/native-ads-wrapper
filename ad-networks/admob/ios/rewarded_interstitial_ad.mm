#include "rewarded_interstitial_ad.h"
#include "rewarded_interstial_ad_listener.h"

namespace wrapper {
    namespace admob {
        std::unique_ptr<RewardedInterstitialAd> RewardedInterstitialAd::_instance;
        RewardedInterstialAdListener *rewardedInterstialListener = [[RewardedInterstialAdListener alloc] init];

        void RewardedInterstitialAd::registerPlacement(const std::string& placementName, const std::string& placementId) {
            placementMap.insert({placementName, placementId});
        }
        void RewardedInterstitialAd::load(const std::string& placementName) {
            if (placementMap.count(placementName) == 0) {
                return;
            }
            auto adUnit = [NSString stringWithUTF8String:placementMap[placementName].c_str()];
            [rewardedInterstialListener load:adUnit listener:_listener];
        }
        void RewardedInterstitialAd::show(const std::string& placementName, const std::string& location) {
            [rewardedInterstialListener show];
        }

        bool RewardedInterstitialAd::isAdLoaded() {
            return [rewardedInterstialListener isAdLoaded];
        }
         bool RewardedInterstitialAd::isAdAvailable() {
            return [rewardedInterstialListener isAdAvailable];
        }
    }
}
