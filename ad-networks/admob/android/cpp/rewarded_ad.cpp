#include "rewarded_ad.h"
#include "platform/android/jni/JniHelper.h"
using namespace wrapper::admob;
std::unique_ptr<RewardedAd> wrapper::admob::RewardedAd::_instance;
bool RewardedAd::isAdLoaded()
{
    return cocos2d::JniHelper::callStaticBooleanMethod(
            "com/wrapper/admob/RewardedAdImplementation",
                                                       "isAdLoaded");
}
bool RewardedAd::isAdAvailable()
{
    return cocos2d::JniHelper::callStaticBooleanMethod(
            "com/wrapper/admob/RewardedAdImplementation",
                                                       "isAdAvailable");
}
void RewardedAd::registerPlacement(const std::string &placementName, const std::string &placementId)
{
    placementMap.insert({placementName, placementId});
}
void RewardedAd::load(const std::string &placementName)
{
    if (placementMap.count(placementName) == 0)
    {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
        "com/wrapper/admob/RewardedAdImplementation",
        "load", placementMap[placementName]);
}
void RewardedAd::show(const std::string &placementName, const std::string& location)
{
    if (placementMap.count(placementName) == 0)
    {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
        "com/wrapper/admob/RewardedAdImplementation",
        "show", placementMap[placementName], location);
}
bool RewardedAd::isPlacementCapped(const std::string& placementName) {
    return false;
}

extern "C"
{
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onClosed(JNIEnv *env, jobject obj)
    {
        RewardedAd::getInstance()->getListener()->onClosed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onRewardGranted(JNIEnv *env, jobject obj)
    {
        RewardedAd::getInstance()->getListener()->onRewardGranted();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onRewardCancelled(JNIEnv *env, jobject obj)
    {
        RewardedAd::getInstance()->getListener()->onRewardCancelled();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onShown(JNIEnv *env, jobject obj) {
        RewardedAd::getInstance()->getListener()->onShown();
    }
JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onAdLoaded(JNIEnv *env, jobject obj) {
    RewardedAd::getInstance()->getListener()->onAdLoaded();
}
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onLoadFailed(JNIEnv *env, jobject obj) {
        RewardedAd::getInstance()->getListener()->onLoadFailed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedAdImplementation_onShowFailed(JNIEnv *env, jobject obj) {
        RewardedAd::getInstance()->getListener()->onShowFailed();
    }
}