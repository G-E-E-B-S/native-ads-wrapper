#ifndef BANNER_LISTENER_H
#define BANNER_LISTENER_H

#include "js_listener_base.h"
#include "BannerAd/banner_implementation.h"
class GameBannerListener : public BannerListener, public  JSListenerBase {
public:
    static GameBannerListener* getInstance() {
        if (_instance.get() == nullptr) {
            _instance.reset(new GameBannerListener());
        }
        return _instance.get();
    }
    virtual bool onLoaded();
    virtual bool onLoadFailed();
    virtual bool onClicked();
    virtual bool onScreenPresented();
    virtual bool onScreenDismissed();
    virtual bool onLeftApplication();
private:
    static std::shared_ptr<GameBannerListener> _instance;
};
#endif // BANNER_LISTENER_H
