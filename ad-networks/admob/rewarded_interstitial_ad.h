#ifndef ADMOB_REWARDED_INTERSTITIAL_AD_H
#define ADMOB_REWARDED_INTERSTITIAL_AD_H

#include "rewarded_interstitial_video_implementation.h"
#include <unordered_map>

namespace wrapper {
    namespace admob {
        class RewardedInterstitialAd : public RewardedInterstitialVideoImplementation {
        public:
            static void init(RewardedInterstitialVideoListener*  listener) {
                _instance.reset(new RewardedInterstitialAd(listener));
            }
            static RewardedInterstitialAd* getInstance() {
                return _instance.get();
            }
            RewardedInterstitialAd(RewardedInterstitialVideoListener* listener) {
                _listener.reset(listener);
            };
            ~ RewardedInterstitialAd() {};
            RewardedInterstitialVideoListener* getListener() {
                return _listener.get();
            }
            virtual bool isAdLoaded() override;
            virtual bool isAdAvailable() override;
            virtual void registerPlacement(const std::string& placementName, const std::string& placementId) override;
            virtual void load(const std::string& placementName) override;
            virtual void show(const std::string& placementName, const std::string& location) override;
            virtual void stopRequesting(const std::string& placementName) override {};
            virtual void stopShow(const std::string& placementName) override {};
            bool isPlacementCapped(const std::string& placementName);
        private:
            std::shared_ptr<RewardedInterstitialVideoListener> _listener;
            std::string _pendingPlacementToShow;
            std::unordered_map<std::string, std::string> placementMap;
            static std::unique_ptr<RewardedInterstitialAd> _instance;
        };
    
    };
};
#endif
