#include "banner_ad.h"
#include "platform/android/jni/JniHelper.h"

using namespace wrapper::admob;
std::unique_ptr<BannerAd> wrapper::admob::BannerAd::_instance;
bool BannerAd::isAdLoaded() {
    return true;
}
bool BannerAd::isAdAvailable() {
    return true;
}
void BannerAd::registerPlacement(const std::string& placementName, const std::string& placementId) {
    placementMap.insert({placementName, placementId});
}
void BannerAd::load(const std::string& placementName) {
    if (placementMap.count(placementName) == 0) {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
            "com/wrapper/admob/BannerAdImplementation",
            "load", placementMap[placementName]);
}
void BannerAd::show(const std::string& placementName, const std::string& location) {
    cocos2d::JniHelper::callStaticVoidMethod(
            "com/wrapper/admob/BannerAdImplementation",
            "show", placementMap[placementName], location);
}
void BannerAd::hide(const std::string& placementName) {
    cocos2d::JniHelper::callStaticVoidMethod(
            "com/wrapper/admob/BannerAdImplementation",
            "hide");
}
void BannerAd::stop() {
    // TODO:
}
void BannerAd::onInitializeComplete() {
    auto oldState = _state;
    _state = State::kInitialized;
}

void BannerAd::onLoadComplete() {
    auto oldState = _state;
    _state = State::kLoaded;
    if (oldState == State::kShowPending) {
        this->show(_pendingPlacementToShow, _pendingPlacementToShowLocation);
    }
}
extern "C"
{
    JNIEXPORT void JNICALL Java_com_wrapper_admob_BannerAdImplementation_onLoaded(JNIEnv *env, jobject obj) {
        BannerAd::getInstance()->getListener()->onLoaded();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_BannerAdImplementation_onLoadFailed(JNIEnv *env, jobject obj) {
        BannerAd::getInstance()->getListener()->onLoadFailed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_BannerAdImplementation_onClicked(JNIEnv *env, jobject obj) {
        BannerAd::getInstance()->getListener()->onClicked();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_BannerAdImplementation_onScreenPresented(JNIEnv *env, jobject obj) {
        BannerAd::getInstance()->getListener()->onScreenPresented();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_BannerAdImplementation_onScreenDismissed(JNIEnv *env, jobject obj) {
        BannerAd::getInstance()->getListener()->onScreenDismissed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_BannerAdImplementation_onLeftApplication(JNIEnv *env, jobject obj) {
        BannerAd::getInstance()->getListener()->onLeftApplication();
    }
}