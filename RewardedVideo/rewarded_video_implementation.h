#ifndef REWARDED_VIDEO_IMPLEMENTATION_H
#define REWARDED_VIDEO_IMPLEMENTATION_H

#include <string>

#include "ad_handler.h"

class RewardedVideoImplementation: public IAdImplementation {
public:
    RewardedVideoImplementation() {};
    virtual ~RewardedVideoImplementation() {};
    virtual void stopRequesting(const std::string& placementName) = 0;
    virtual void stopShow(const std::string& placementName) = 0;
};
class RewardedVideoListener {
public:
    RewardedVideoListener() {};
    virtual ~RewardedVideoListener() {};
    virtual bool onClosed()  = 0;
    virtual bool onRewardGranted() = 0;
    virtual bool onRewardCancelled() = 0;
    virtual bool onShown() = 0;
    virtual bool onAdLoaded() = 0;
    virtual bool onLoadFailed() = 0;
    virtual bool onShowFailed() = 0;
};

#endif // REWARDED_VIDEO_IMPLEMENTATION_H
