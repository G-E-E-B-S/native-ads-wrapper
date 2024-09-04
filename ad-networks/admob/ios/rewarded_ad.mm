#include "rewarded_ad.h"
#include "rewarded_ad_listener.h"

namespace wrapper {
    namespace admob {
        std::unique_ptr<RewardedAd> RewardedAd::_instance;
        RewardedAdListener *rewardedListener = [[RewardedAdListener alloc] init];

        void RewardedAd::registerPlacement(const std::string& placementName, const std::string& placementId) {
            placementMap.insert({placementName, placementId});
        }
        void RewardedAd::load(const std::string& placementName) {
            if (placementMap.count(placementName) == 0) {
                return;
            }
            auto adUnit = [NSString stringWithUTF8String:placementMap[placementName].c_str()];
            [rewardedListener load:adUnit listener:_listener];
        }
        void RewardedAd::show(const std::string& placementName, const std::string& location) {
            [rewardedListener show];
        }

        bool RewardedAd::isAdLoaded() {
            return [rewardedListener isAdLoaded];
        }
         bool RewardedAd::isAdAvailable() {
            return [rewardedListener isAdAvailable];
        }
    }
}
