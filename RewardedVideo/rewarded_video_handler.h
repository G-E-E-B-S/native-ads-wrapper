#ifndef REWARDED_VIDEO_HANDLER_H
#define REWARDED_VIDEO_HANDLER_H
#include <memory>
#include <string>

#include "rewarded_video_implementation.h"


class RewardedVideo
{
public:
    static void init(RewardedVideoImplementation* implementation, RewardedVideoListener* listener) {
        _instance.reset(new RewardedVideo(implementation, listener));
    }
    static RewardedVideo* getInstance() {
        return _instance.get();
    }
    RewardedVideo(RewardedVideoImplementation* implementation, RewardedVideoListener* listener) {
        _implementation.reset(implementation);
        _listener.reset(listener);
    };
    ~RewardedVideo() {};
    RewardedVideoListener* getListener() {
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
    std::unique_ptr<RewardedVideoImplementation> _implementation;
    std::shared_ptr<RewardedVideoListener> _listener;
    static std::unique_ptr<RewardedVideo> _instance;
};

#endif // REWARDED_VIDEO_HANDLER_H

