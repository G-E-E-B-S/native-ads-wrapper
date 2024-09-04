#ifndef REWARDED_INTERSTITIAL_VIDEO_HANDLER_H
#define REWARDED_INTERSTITIAL_VIDEO_HANDLER_H
#include <memory>
#include <string>

#include "rewarded_interstitial_video_implementation.h"

class RewardedInterstitialVideo
{
public:
    static void init(RewardedInterstitialVideoImplementation* implementation, RewardedInterstitialVideoListener* listener) {
        _instance.reset(new RewardedInterstitialVideo(implementation, listener));
    }
    static RewardedInterstitialVideo* getInstance() {
        return _instance.get();
    }
    RewardedInterstitialVideo(RewardedInterstitialVideoImplementation* implementation, RewardedInterstitialVideoListener* listener) {
        _implementation.reset(implementation);
        _listener.reset(listener);
    };
    ~RewardedInterstitialVideo() {};
    RewardedInterstitialVideoListener* getListener() {
        return _listener.get();
    }
    virtual void registerPlacement(const std::string& placementName, const std::string& placementId) {
        _implementation->registerPlacement(placementName, placementId);
    };
    virtual void load(const std::string& placementName) {
        _implementation->load(placementName);
    };
    virtual void show(const std::string& placementName, const std::string& location) {
        _implementation->show(placementName, location);
    }
    virtual bool isAdLoaded() {
        return _implementation->isAdLoaded();
    }
    virtual bool isAdAvailable() {
        return _implementation->isAdAvailable();
    }
    void stopRequesting(const std::string& placementName) {
        _implementation->stopRequesting(placementName);
    }
    void stopShow(const std::string& placementName) {
        _implementation->stopShow(placementName);
    }
private:
    std::unique_ptr<RewardedInterstitialVideoImplementation> _implementation;
    std::shared_ptr<RewardedInterstitialVideoListener> _listener;
    static std::unique_ptr<RewardedInterstitialVideo> _instance;
};

#endif // REWARDED_INTERSTITIAL_VIDEO_HANDLER_H
