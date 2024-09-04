#ifndef ADMOB_BANNER_H
#define ADMOB_BANNER_H
#include "banner_implementation.h"
#include "state.h"

#include <memory>
#include <unordered_map>
namespace wrapper {
    namespace admob {
        class BannerAd: public BannerImplementation {
        public:
            static void init(BannerListener*  listener) {
                _instance.reset(new BannerAd(listener));
            }
            static BannerAd* getInstance() {
                return _instance.get();
            }
            BannerAd(BannerListener*  listener) {
                _listener.reset(listener);
            };
            ~ BannerAd() {};
            BannerListener* getListener() {
                return _listener.get();
            }
            bool isPlacementCapped(const std::string& placementName);
            virtual void registerPlacement(const std::string& placementName, const std::string& placementId) override;
            virtual void show(const std::string& placementName, const std::string& location) override;
            virtual void hide(const std::string& placementName) override;
            virtual bool isAdLoaded() override;
            virtual bool isAdAvailable() override;
            virtual void load(const std::string& placementName) override;
            virtual void stop();
        private:
            virtual void onInitializeComplete();
            virtual void onLoadComplete();
            
            
            bool _loadOnInit = false;
            State _state;
            std::string _pendingPlacementToShow;
            std::string _pendingPlacementToShowLocation;
            std::unordered_map<std::string, std::string> placementMap;
            std::shared_ptr<BannerListener> _listener;
            static std::unique_ptr<BannerAd> _instance;
        };
    }
}

#endif // ADMOB_BANNER_H
