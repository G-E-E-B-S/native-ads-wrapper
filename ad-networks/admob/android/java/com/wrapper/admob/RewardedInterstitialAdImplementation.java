package com.wrapper.admob;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import com.wrapper.AdEventData;
import com.wrapper.IAdImpressionListener;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdValue;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.OnPaidEventListener;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.ResponseInfo;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAd;
import com.google.android.gms.ads.rewardedinterstitial.RewardedInterstitialAdLoadCallback;

public class RewardedInterstitialAdImplementation extends FullScreenContentCallback {
    private static RewardedInterstitialAdImplementation sRewardedAd;
    private static String TAG = "RewardedInterstitialAdImplementation";
    private Activity mActivity;
    private RewardedInterstitialAd mRewardedAd;
    private AdStatus mAdStatus;
    private String mLoadedPlacement;
    private boolean mRewardGranted;
    private String mLocation;
    private IAdImpressionListener mAdImpressionListener;

    public RewardedInterstitialAdImplementation(Activity activity, IAdImpressionListener listener) {
        mActivity = activity;
        sRewardedAd = this;
        mAdStatus = AdStatus.NotAvailable;
        mAdImpressionListener = listener;
    }

    public static void load(final String placementName) {
        if (sRewardedAd.mAdStatus != AdStatus.NotAvailable) {
            return;
        }
        sRewardedAd.mAdStatus = AdStatus.Loading;
        sRewardedAd.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                sRewardedAd.loadOnUiThread(placementName);
            }
        });
    }

    public static void show(String placementName, String location) {
        sRewardedAd.mLocation = location;
        if (sRewardedAd.mRewardedAd != null) {
            sRewardedAd.mAdStatus = AdStatus.Showing;
            sRewardedAd.mActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    RewardedInterstitialAd rewardedAd = sRewardedAd.mRewardedAd;
                    rewardedAd.setFullScreenContentCallback(sRewardedAd);
                    rewardedAd.show(sRewardedAd.mActivity, new
                            OnUserEarnedRewardListener() {
                                @Override
                                public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                                    // Handle the reward.
                                    Log.d(TAG, "The user earned the reward.");
                                    sRewardedAd.mRewardGranted = true;
                                    int rewardAmount = rewardItem.getAmount();
                                    String rewardType = rewardItem.getType();
                                    sRewardedAd.onRewardGranted();
                                }
                            });
                }
            });
        } else {
            Log.d(TAG, "The ad wasn't ready yet.");
        }
    }

    public static boolean isAdLoaded() {
        return sRewardedAd.mAdStatus == AdStatus.Loaded;
    }

    public static boolean isAdAvailable() {
        return sRewardedAd.mAdStatus == AdStatus.Loaded || sRewardedAd.mAdStatus == AdStatus.Loading;
    }

    @Override
    public void onAdDismissedFullScreenContent() {
        // Called when fullscreen content is dismissed.
        Log.d(TAG, "The ad was dismissed.");
        clearRewardedAd();
        mAdStatus = AdStatus.NotAvailable;
        onClosed();
        if (!mRewardGranted) {
            onRewardCancelled();
        } else {
            // prepare for next viewing
            mRewardGranted = false;
        }
    }

    @Override
    public void onAdFailedToShowFullScreenContent(AdError adError) {
        // Called when fullscreen content failed to show.
        Log.d(TAG, "The ad failed to show.");
        clearRewardedAd();
        mAdStatus = AdStatus.NotAvailable;
        Log.e(TAG, adError.getMessage());
        Log.e(TAG, String.format("domain: %s, code: %d, message: %s",
                adError.getDomain(), adError.getCode(), adError.getMessage()));
        onShowFailed();
    }

    @Override
    public void onAdShowedFullScreenContent() {
        // Called when fullscreen content is shown.
        // Make sure to set your reference to null so you don't
        // show it a second time.
        Log.d(TAG, "The ad was shown.");
        onShown();
    }

    private void loadOnUiThread(String placementName) {
        final AdRequest adRequest = new AdRequest.Builder().build();
        mLoadedPlacement = placementName;
        RewardedInterstitialAd.load(sRewardedAd.mActivity, placementName, adRequest, new RewardedInterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull RewardedInterstitialAd rewardedAd) {
                // The mInterstitialAd reference will be null until
                // an ad is loaded.
                sRewardedAd.mAdStatus = AdStatus.Loaded;
                sRewardedAd.clearRewardedAd();
                sRewardedAd.mRewardedAd = rewardedAd;
                mRewardedAd.setOnPaidEventListener(new OnPaidEventListener() {
                    @Override
                    public void onPaidEvent(AdValue adValue) {
                        AdEventData eventData = new AdEventData();
                        eventData.platform = "AdMob";
                        eventData.type = "rewarded_interstitial";
                        eventData.location = mLocation;
                        eventData.currencyCode = adValue.getCurrencyCode();
                        eventData.revenue = adValue.getValueMicros() / 1000000.0;
                        ResponseInfo responseInfo = mRewardedAd.getResponseInfo();
                        eventData.networkName = responseInfo.getMediationAdapterClassName();
                        eventData.unitId = mRewardedAd.getAdUnitId();
                        eventData.precision = adValue.getPrecisionType();
                        mAdImpressionListener.onAdImpression(eventData);
                    }
                });
                sRewardedAd.onAdLoaded();
                Log.i(TAG, "onAdLoaded");
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                Log.i(TAG, "onAdFailedToLoad");
                // Handle the error
                Log.e(TAG, loadAdError.getMessage());
                Log.e(TAG, String.format("domain: %s, code: %d, message: %s",
                        loadAdError.getDomain(), loadAdError.getCode(), loadAdError.getMessage()));
                sRewardedAd.mAdStatus = AdStatus.NotAvailable;
                sRewardedAd.clearRewardedAd();
                sRewardedAd.onLoadFailed();
            }
        });
    }

    private void clearRewardedAd() {
        if (mRewardedAd != null) {
            mRewardedAd.setOnPaidEventListener(null);
        }
        mRewardedAd = null;
    }

    private native void onClosed();

    private native void onRewardGranted();

    private native void onRewardCancelled();

    private native void onShown();

    private native void onAdLoaded();

    private native void onLoadFailed();

    private native void onShowFailed();
}