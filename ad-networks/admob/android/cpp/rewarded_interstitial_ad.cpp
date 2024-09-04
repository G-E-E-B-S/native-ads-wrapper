#include "rewarded_interstitial_ad.h"
#include "platform/android/jni/JniHelper.h"
using namespace wrapper::admob;
std::unique_ptr<RewardedInterstitialAd> wrapper::admob::RewardedInterstitialAd::_instance;
bool RewardedInterstitialAd::isAdLoaded()
{
    return cocos2d::JniHelper::callStaticBooleanMethod(
        "com/wrapper/admob/RewardedInterstitialAdImplementation",
        "isAdLoaded");
}
bool RewardedInterstitialAd::isAdAvailable()
{
    return cocos2d::JniHelper::callStaticBooleanMethod(
        "com/wrapper/admob/RewardedInterstitialAdImplementation",
        "isAdAvailable");
}
void RewardedInterstitialAd::registerPlacement(const std::string &placementName, const std::string &placementId)
{
    placementMap.insert({placementName, placementId});
}
void RewardedInterstitialAd::load(const std::string &placementName)
{
    if (placementMap.count(placementName) == 0)
    {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
        "com/wrapper/admob/RewardedInterstitialAdImplementation",
        "load", placementMap[placementName]);
}

void RewardedInterstitialAd::show(const std::string &placementName, const std::string& location)
{
    if (placementMap.count(placementName) == 0)
    {
        return;
    }
    cocos2d::JniHelper::callStaticVoidMethod(
        "com/wrapper/admob/RewardedInterstitialAdImplementation",
        "show", placementMap[placementName], location);
}
bool RewardedInterstitialAd::isPlacementCapped(const std::string& placementName) {
    return false;
}

extern "C"
{
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onClosed(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onClosed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onRewardGranted(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onRewardGranted();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onRewardCancelled(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onRewardCancelled();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onShown(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onShown();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onAdLoaded(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onAdLoaded();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onLoadFailed(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onLoadFailed();
    }
    JNIEXPORT void JNICALL Java_com_wrapper_admob_RewardedInterstitialAdImplementation_onShowFailed(JNIEnv *env, jobject obj)
    {
        RewardedInterstitialAd::getInstance()->getListener()->onShowFailed();
    }
}