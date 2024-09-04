#include "rewarded_ad_listener.h"

#include "platform/CCApplication.h"
#include "base/CCScheduler.h"

std::shared_ptr<GameRewardedAdListener> GameRewardedAdListener::_instance;

bool GameRewardedAdListener::onClosed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedAdListener::onAdLoaded() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedAdListener::onRewardGranted() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedAdListener::onRewardCancelled() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedAdListener::onShown() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedAdListener::onLoadFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameRewardedAdListener::onShowFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
