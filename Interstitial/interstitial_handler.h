#ifndef INTERSTITIAL_HANDLER_H
#define INTERSTITIAL_HANDLER_H
#include <memory>
#include <string>
#include "interstitial_implementation.h"
class Interstitial
{
public:
    static void init(InterstitialImplementation *implementation, InterstitalListener* listener) {
        _instance.reset(new Interstitial(implementation, listener));
    }
    static Interstitial* getInstance() {
        return _instance.get();
    }
    Interstitial(InterstitialImplementation *implementation, InterstitalListener* listener) {
        _implementation.reset(implementation);
        _listener.reset(listener);
    };
    ~Interstitial() {};
    InterstitalListener* getListener() {
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
    void stop() {
        _implementation->stop();
    };
    bool isPlacementCapped(const std::string& placementName) {
        return _implementation->isPlacementCapped(placementName);
    };
private:
    static std::unique_ptr<Interstitial> _instance;
    std::unique_ptr<InterstitialImplementation> _implementation;
    std::shared_ptr<InterstitalListener> _listener;
};

#endif

