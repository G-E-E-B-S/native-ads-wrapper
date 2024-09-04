#ifndef ADMOB_REWARDED_AD_H
#define ADMOB_REWARDED_AD_H

#include "rewarded_video_implementation.h"
#include <unordered_map>

namespace wrapper {
    namespace admob {
        class RewardedAd : public RewardedVideoImplementation {
        public:
            static void init(RewardedVideoListener*  listener) {
                _instance.reset(new RewardedAd(listener));
            }
            static RewardedAd* getInstance() {
                return _instance.get();
            }
            RewardedAd(RewardedVideoListener* listener) {
                _listener.reset(listener);
            };
            ~ RewardedAd() {};
            RewardedVideoListener* getListener() {
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
            std::shared_ptr<RewardedVideoListener> _listener;
            std::string _pendingPlacementToShow;
            std::unordered_map<std::string, std::string> placementMap;
            static std::unique_ptr<RewardedAd> _instance;
        };
    
    };
};
#endif
