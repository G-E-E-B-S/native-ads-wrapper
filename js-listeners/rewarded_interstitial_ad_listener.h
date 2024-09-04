#ifndef REWARDED_INTERSTITIAL_AD_LISTENER_H
#define REWARDED_INTERSTITIAL_AD_LISTENER_H

#include "js_listener_base.h"
#include "RewardedInterstitialVideo/rewarded_interstitial_video_implementation.h"

class GameRewardedInterstitialAdListener : public RewardedInterstitialVideoListener, public  JSListenerBase {
public:
    static GameRewardedInterstitialAdListener* getInstance() {
        if (_instance.get() == nullptr) {
            _instance.reset(new GameRewardedInterstitialAdListener());
        }
        return _instance.get();
    }
    virtual bool onClosed();
    virtual bool onRewardGranted();
    virtual bool onRewardCancelled();
    virtual bool onShown();
    virtual bool onAdLoaded();
    virtual bool onLoadFailed();
    virtual bool onShowFailed();
private:
    static std::shared_ptr<GameRewardedInterstitialAdListener> _instance;
};
#endif // REWARDED_INTERSTITIAL_AD_LISTENER_H
