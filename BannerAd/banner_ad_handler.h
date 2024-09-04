#ifndef BANNER_AD_HANDLER_H
#define BANNER_AD_HANDLER_H
#include <memory>
#include <string>
#include "banner_implementation.h"
class BannerAd
{
public:
    static void init(BannerImplementation* impl, BannerListener* listener) {
        _instance.reset(new BannerAd(impl, listener));
    }
    static BannerAd* getInstance() {
        return _instance.get();
    }
    BannerAd(BannerImplementation* implementation,BannerListener* listener) {
        _implementation.reset(implementation);
        _listener.reset(listener);
    };
    ~BannerAd() {};
    BannerListener* getListener() {
        return _listener.get();
    }
    void registerPlacement(const std::string& placementName, const std::string& placementId) {
        _implementation->registerPlacement(placementName, placementId);
    };
    void load(const std::string& placementName) {
        _implementation->load(placementName);
    };
    void show(const std::string& placementName, const std::string& location) {
        _implementation->show(placementName, location);
    }
    bool isAdLoaded() {
        return _implementation->isAdLoaded();
    }
    bool isAdAvailable() {
        return _implementation->isAdAvailable();
    }
    void hide(const std::string& placementName)  {
        _implementation->hide(placementName);
    }
private:
    std::unique_ptr<BannerImplementation> _implementation;
    std::shared_ptr<BannerListener> _listener;
    static std::unique_ptr<BannerAd> _instance;
};

#endif

