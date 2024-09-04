#ifndef INTERSTITIAL_LISTENER_H
#define INTERSTITIAL_LISTENER_H
#include "js_listener_base.h"
#include "Interstitial/interstitial_implementation.h"

class GameInterstitialListener : public InterstitalListener, public  JSListenerBase {
public:
    static GameInterstitialListener* getInstance() {
        if (_instance.get() == nullptr) {
            _instance.reset(new GameInterstitialListener());
        }
        return _instance.get();
    }
    virtual bool onClosed() override;
    virtual bool onShown() override;
    virtual bool onLoadFailed() override;
    virtual bool onShowFailed() override;
private:
    static std::shared_ptr<GameInterstitialListener> _instance;
};
#endif // INTERSTITIAL_LISTENER_H
