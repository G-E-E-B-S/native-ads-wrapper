#include "banner_listener.h"

#include "platform/CCApplication.h"
#include "base/CCScheduler.h"

std::shared_ptr<GameBannerListener> GameBannerListener::_instance;

bool GameBannerListener::onLoaded() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameBannerListener::onLoadFailed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameBannerListener::onClicked() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameBannerListener::onScreenPresented() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameBannerListener::onScreenDismissed() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
bool GameBannerListener::onLeftApplication() {
    RUN_ON_MAIN_THREAD_BEGIN
    MAKE_V8_HAPPY
    
    se::ValueArray args;
    invokeJSFun(funcName, args);
    
    RUN_ON_MAIN_THREAD_END
    
    // just return true, now
    return true;
}
