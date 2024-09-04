#include "NativeAdsJSHelper.h"
#include "js_listener_base.h"
#include "RewardedVideo/rewarded_video_handler.h"

#include "rewarded_interstitial_ad_listener.h"
#include "RewardedInterstitialVideo/rewarded_interstitial_video_handler.h"
#include "ad-networks/admob/rewarded_interstitial_ad.h"

#include "rewarded_ad_listener.h"
#include "RewardedVideo/rewarded_video_handler.h"
#include "ad-networks/admob/rewarded_ad.h"


#include "interstitial_listener.h"
#include "Interstitial/interstitial_handler.h"
#include "ad-networks/admob/interstitial_ad.h"

#include "banner_listener.h"
#include "BannerAd/banner_ad_handler.h"
#include "ad-networks/admob/banner_ad.h"

static bool js_NativeAdsJS_setBannerListener(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        static GameBannerListener* bannerListener = nullptr;
        if (!bannerListener) {
            bannerListener = new (std::nothrow) GameBannerListener();
            BannerImplementation* impl = nullptr;
#ifdef NATIVE_ADS_ADMOB
            wrapper::admob::BannerAd::init(bannerListener);
            impl = wrapper::admob::BannerAd::getInstance();
#endif
            BannerAd::init(impl, bannerListener);
        }
        bannerListener->setJSDelegate(args[0]);
        
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    
    return false;
}
SE_BIND_FUNC(js_NativeAdsJS_setBannerListener)
static bool js_NativeAdsJS_setInterstitialListener(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        static GameInterstitialListener* interstitialListener = nullptr;
        if (!interstitialListener) {
            interstitialListener = new (std::nothrow) GameInterstitialListener();
            InterstitialImplementation* impl = nullptr;
#ifdef NATIVE_ADS_ADMOB
            wrapper::admob::InterstitialAd::init(interstitialListener);
            impl = wrapper::admob::InterstitialAd::getInstance();
#endif
            Interstitial::init(impl, interstitialListener);
        }
        interstitialListener->setJSDelegate(args[0]);
        
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    
    return false;
}
SE_BIND_FUNC(js_NativeAdsJS_setInterstitialListener)
static bool js_NativeAdsJS_setRewardedListener(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        static GameRewardedAdListener* rewardedListener = nullptr;
        if (!rewardedListener) {
            rewardedListener = new (std::nothrow) GameRewardedAdListener();
            RewardedVideoImplementation* impl = nullptr;
#ifdef NATIVE_ADS_ADMOB
            wrapper::admob::RewardedAd::init(rewardedListener);
            impl = wrapper::admob::RewardedAd::getInstance();
#endif
            RewardedVideo::init(impl, rewardedListener);
        }
        rewardedListener->setJSDelegate(args[0]);
        
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    
    return false;
}
SE_BIND_FUNC(js_NativeAdsJS_setRewardedListener)
static bool js_NativeAdsJS_setRewardedInterstiailListener(se::State& s) {
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        static GameRewardedInterstitialAdListener* rewardedInterstitialListener = nullptr;
        if (!rewardedInterstitialListener) {
            rewardedInterstitialListener = new (std::nothrow) GameRewardedInterstitialAdListener();
            RewardedInterstitialVideoImplementation* impl = nullptr;
#ifdef NATIVE_ADS_ADMOB
            wrapper::admob::RewardedInterstitialAd::init(rewardedInterstitialListener);
            impl = wrapper::admob::RewardedInterstitialAd::getInstance();
#endif
            RewardedInterstitialVideo::init(impl, rewardedInterstitialListener);
        }
        rewardedInterstitialListener->setJSDelegate(args[0]);
        
        return true;
    }
    
    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    
    return false;
}
SE_BIND_FUNC(js_NativeAdsJS_setRewardedInterstiailListener)

static inline void split(const std::string &src, const std::string &token, std::vector<std::string> &vect)
{
    size_t nend = 0;
    size_t nbegin = 0;
    size_t tokenSize = token.size();
    while (nend != std::string::npos)
    {
        nend = src.find(token, nbegin);
        if (nend == std::string::npos)
            vect.push_back(src.substr(nbegin, src.length() - nbegin));
        else
            vect.push_back(src.substr(nbegin, nend - nbegin));
        nbegin = nend + tokenSize;
    }
}
static inline se::Value getPluginValue(se::Object *obj, const std::string &name)
{
    std::vector<std::string> vect;
    split(name, ".", vect);

    se::Value parent(obj, true);
    se::Value ret;
    for (auto n : vect)
    {
        se::Object *pObj = parent.toObject();
        if (nullptr == pObj)
        {
            // shoudn't be here
            break;
        }
        if (!pObj->getProperty(n.c_str(), &ret))
        {
            // shouldn't be here
            break;
        }
        parent.setObject(ret.toObject(), true);
    }
    return ret;
}
bool register_all_native_ads_JS_helper(se::Object* obj) {
    auto pluginValue = getPluginValue(obj, "ads");
    auto plugin = pluginValue.toObject();
    plugin->defineFunction("setBannerListener", _SE(js_NativeAdsJS_setBannerListener));
    plugin->defineFunction("setInterstitialListener", _SE(js_NativeAdsJS_setInterstitialListener));
    plugin->defineFunction("setRewardedListener", _SE(js_NativeAdsJS_setRewardedListener));
    plugin->defineFunction("setRewardedInterstitalListener", _SE(js_NativeAdsJS_setRewardedInterstiailListener));
    
    se::ScriptEngine::getInstance()->clearException();
    return true;
}
