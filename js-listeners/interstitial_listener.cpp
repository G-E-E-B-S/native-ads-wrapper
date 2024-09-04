#include "interstitial_listener.h"

#include "platform/CCApplication.h"
#include "base/CCScheduler.h"

std::shared_ptr<GameInterstitialListener> GameInterstitialListener::_instance;

bool GameInterstitialListener::onClosed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameInterstitialListener::onShown() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameInterstitialListener::onLoadFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameInterstitialListener::onShowFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
