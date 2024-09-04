#ifndef BANNER_IMPLEMENTATION_H
#define BANNER_IMPLEMENTATION_H

#include "ad_handler.h"
#include <string>

class BannerListener {
public:
    virtual ~BannerListener() {};
    virtual bool onLoaded() = 0;
    virtual bool onLoadFailed() = 0;
    virtual bool onClicked() = 0;
    virtual bool onScreenPresented() = 0;
    virtual bool onScreenDismissed() = 0;
    virtual bool onLeftApplication() = 0;
};
class BannerImplementation : public IAdImplementation {
public:
    virtual ~BannerImplementation() {};
    virtual void hide(const std::string& placementName) = 0;
};

#endif // BANNER_IMPLEMENTATION_H
