LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := native_ads

LOCAL_MODULE_FILENAME := libcnativeads

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := ../Interstitial/interstitial_handler.cpp \
	../RewardedVideo/rewarded_video_handler.cpp \
	../RewardedInterstitialVideo/rewarded_interstitial_video_handler.cpp \
	../BannerAd/banner_ad_handler.cpp \
	../ad-networks/admob/android/cpp/banner_ad.cpp \
	../ad-networks/admob/android/cpp/interstitial_ad.cpp \
	../ad-networks/admob/android/cpp/rewarded_ad.cpp \
	../ad-networks/admob/android/cpp/rewarded_interstitial_ad.cpp \
	../js-listeners/banner_listener.cpp \
	../js-listeners/interstitial_listener.cpp \
	../js-listeners/rewarded_ad_listener.cpp \
	../js-listeners/rewarded_interstitial_ad_listener.cpp \
	../js-listeners/js_listener_base.cpp \
	../NativeAdsJSHelper.cpp
				
LOCAL_CFLAGS    += -DTARGET_PLATFORM=1 -DNATIVE_ADS_ADMOB

LOCAL_STATIC_LIBRARIES := cocos2dx_static
LOCAL_STATIC_LIBRARIES += logging

LOCAL_C_INCLUDES = $(LOCAL_PATH)/../Interstitial
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../RewardedVideo
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../RewardedInterstitialVideo
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../BannerAd
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../ad-networks
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../ad-networks/admob
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../js-listeners
LOCAL_C_INCLUDES += $(LOCAL_PATH)/../

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_C_INCLUDES)

$(call import-module, logging)
$(call import-module, cocos)
include $(BUILD_STATIC_LIBRARY)