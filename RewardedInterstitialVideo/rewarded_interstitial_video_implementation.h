#ifndef REWARDED_INTERSTITIAL_VIDEO_IMPLEMENTATION_H
#define REWARDED_INTERSTITIAL_VIDEO_IMPLEMENTATION_H

#include <string>

#include "ad_handler.h"

class RewardedInterstitialVideoImplementation: public IAdImplementation {
public:
    RewardedInterstitialVideoImplementation() {};
    virtual ~RewardedInterstitialVideoImplementation() {};
    virtual void stopRequesting(const std::string& placementName) = 0;
    virtual void stopShow(const std::string& placementName) = 0;
};
class RewardedInterstitialVideoListener {
public:
    RewardedInterstitialVideoListener() {};
    virtual ~RewardedInterstitialVideoListener() {};
    virtual bool onClosed() = 0;
    virtual bool onRewardGranted() = 0;
    virtual bool onRewardCancelled() = 0;
    virtual bool onShown() = 0;
    virtual bool onAdLoaded()  = 0;
    virtual bool onLoadFailed()  = 0;
    virtual bool onShowFailed()  = 0;
};

#endif // REWARDED_INTERSTITIAL_VIDEO_IMPLEMENTATION_H
