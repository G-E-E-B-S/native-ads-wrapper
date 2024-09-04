#ifndef INTERSTITIAL_IMPLEMENTATION_H
#define INTERSTITIAL_IMPLEMENTATION_H

#include "ad_handler.h"
#include <string>

class InterstitalListener {
public:
    virtual ~InterstitalListener() {};
    virtual bool onClosed() = 0;
    virtual bool onShown() = 0;
    virtual bool onLoadFailed() = 0;
    virtual bool onShowFailed() = 0;
};
class InterstitialImplementation: public IAdImplementation {
public:
    virtual ~InterstitialImplementation() {};
    virtual void stop() = 0;
    virtual bool isPlacementCapped(const std::string& placementName) = 0;
};

#endif // INTERSTITIAL_IMPLEMENTATION_H
