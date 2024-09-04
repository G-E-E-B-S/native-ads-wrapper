#ifndef REWARDED_AD_LISTENER_H
#define REWARDED_AD_LISTENER_H

#include "js_listener_base.h"
#include "RewardedVideo/rewarded_video_implementation.h"

class GameRewardedAdListener : public RewardedVideoListener, public  JSListenerBase {
public:
    static GameRewardedAdListener* getInstance() {
        if (_instance.get() == nullptr) {
            _instance.reset(new GameRewardedAdListener());
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
    static std::shared_ptr<GameRewardedAdListener> _instance;
};
#endif // REWARDED_AD_LISTENER_H
