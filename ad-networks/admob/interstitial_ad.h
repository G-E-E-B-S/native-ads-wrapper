#ifndef ADMOB_INTERSTITIAL_H
#define ADMOB_INTERSTITIAL_H
#include "interstitial_implementation.h"
#include "state.h"
#include <unordered_map>
namespace wrapper {
    namespace admob {
        class InterstitialAd: public InterstitialImplementation {
        public:
            static void init(InterstitalListener*  listener) {
                _instance.reset(new InterstitialAd(listener));
            }
            static InterstitialAd* getInstance() {
                return _instance.get();
            }
            InterstitialAd(InterstitalListener* listener) {
                _listener.reset(listener);
            };
            ~ InterstitialAd() {};
            InterstitalListener* getListener() {
                return _listener.get();
            }
            virtual void registerPlacement(const std::string& placementName, const std::string& placementId) override;
            virtual void stop() override;
            virtual bool isAdLoaded() override;
            virtual bool isAdAvailable() override;
            virtual void load(const std::string& placementName) override;
            virtual void show(const std::string& placementName, const std::string& location) override;
            virtual bool isPlacementCapped(const std::string& placementName) override;
        private:
            std::shared_ptr<InterstitalListener> _listener;
            std::string _pendingPlacementToShow;
            std::unordered_map<std::string, std::string> placementMap;
            static std::unique_ptr<InterstitialAd> _instance;
        };
    }
}
#endif // ADMOB_INTERSTITIAL_H
