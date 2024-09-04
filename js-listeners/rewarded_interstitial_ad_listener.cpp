#include "rewarded_interstitial_ad_listener.h"

#include "platform/CCApplication.h"
#include "base/CCScheduler.h"

std::shared_ptr<GameRewardedInterstitialAdListener> GameRewardedInterstitialAdListener::_instance;

bool GameRewardedInterstitialAdListener::onClosed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedInterstitialAdListener::onAdLoaded() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedInterstitialAdListener::onRewardGranted() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedInterstitialAdListener::onRewardCancelled() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedInterstitialAdListener::onShown() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedInterstitialAdListener::onLoadFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedInterstitialAdListener::onShowFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
