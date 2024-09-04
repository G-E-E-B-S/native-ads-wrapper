#include "interstitial_ad.h"
#include "platform/android/jni/JniHelper.h"

using namespace wrapper::admob;
std::unique_ptr<InterstitialAd> wrapper::admob::InterstitialAd::_instance;
bool InterstitialAd::isAdLoaded() {
    return cocos2d::JniHelper::callStaticBooleanMethod(
            "com/wrapper/admob/InterstitialAdImplementation",
            "isAdLoaded");
}
bool InterstitialAd::isAdAvailable() {
    return cocos2d::JniHelper::callStaticBooleanMethod(
            "com/wrapper/admob/InterstitialAdImplementation",
            "isAdAvailable");
}
void InterstitialAd::registerPlacement(const std::string& placementName, const std::string& placementId) {
    placementMap.insert({placementName, placementId});
}
void InterstitialAd::load(const std::string& placementName) {
    if (placementMap.count(placementName) == 0) {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
            "com/wrapper/admob/InterstitialAdImplementation",
            "load", placementMap[placementName]);
}
void InterstitialAd::show(const std::string& placementName, const std::string& location) {
    if (placementMap.count(placementName) == 0) {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
            "com/wrapper/admob/InterstitialAdImplementation",
            "show", placementMap[placementName], location);
}

bool InterstitialAd::isPlacementCapped(const std::string& placementName) {
    // TODO:
    return false;
}
void InterstitialAd::stop() {
    // TODO:
}

extern "C" {
    JNIEXPORT void JNICALL Java_com_wrapper_admob_InterstitialAdImplementation_onClosed(JNIEnv *env, jobject obj) {
        InterstitialAd::getInstance()->getListener()->onClosed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_InterstitialAdImplementation_onShown(JNIEnv *env, jobject obj) {
        InterstitialAd::getInstance()->getListener()->onShown();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_InterstitialAdImplementation_onLoadFailed(JNIEnv *env, jobject obj) {
        InterstitialAd::getInstance()->getListener()->onLoadFailed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_InterstitialAdImplementation_onShowFailed(JNIEnv *env, jobject obj) {
        InterstitialAd::getInstance()->getListener()->onShowFailed();
    }
}