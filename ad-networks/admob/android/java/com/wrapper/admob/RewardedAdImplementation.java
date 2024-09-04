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
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class RewardedAdImplementation extends FullScreenContentCallback {
    private static RewardedAdImplementation sRewardedAd;
    private static String TAG = "RewardedAdImplementation";
    private Activity mActivity;
    private RewardedAd mRewardedAd;
    private AdStatus mAdStatus;
    private String mLoadedPlacement;
    private boolean mRewardGranted;
    private String mLocation;
    private IAdImpressionListener mAdImpressionListener;
    public RewardedAdImplementation(Activity activity, IAdImpressionListener listener) {
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
        if (sRewardedAd.mAdStatus != AdStatus.Loaded) {
            Log.e(TAG, "Show called without ad being loaded");
            sRewardedAd.onShowFailed();
            return;
        }
        sRewardedAd.mAdStatus = AdStatus.Showing;
        sRewardedAd.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                RewardedAd rewardedAd = sRewardedAd.mRewardedAd;
                if (rewardedAd != null) {
                    rewardedAd.setFullScreenContentCallback(sRewardedAd);
                    rewardedAd.show(sRewardedAd.mActivity, new

                            OnUserEarnedRewardListener() {
                                @Override
                                public void onUserEarnedReward(@NonNull RewardItem
                                                                       rewardItem) {
                                    // Handle the reward.
                                    Log.d(TAG, "The user earned the reward.");
                                    sRewardedAd.mRewardGranted = true;
                                    int rewardAmount = rewardItem.getAmount();
                                    String rewardType = rewardItem.getType();
                                    sRewardedAd.onRewardGranted();
                                }
                            });
                } else {
                    Log.d(TAG, "The ad was null.");
                }
            }
        });
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

    // Callbacks from AppActivity
    public void onPause() {
    }

    public void onResume() {
    }

    public void onDestroy() {
    }

    private void loadOnUiThread(String placementName) {
        final AdRequest adRequest = new AdRequest.Builder().build();
        mLoadedPlacement = placementName;
        sRewardedAd.clearRewardedAd();
        RewardedAd.load(sRewardedAd.mActivity, placementName, adRequest, new RewardedAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
                // The mInterstitialAd reference will be null until
                // an ad is loaded.
                sRewardedAd.mAdStatus = AdStatus.Loaded;
                sRewardedAd.mRewardedAd = rewardedAd;
                mRewardedAd.setOnPaidEventListener(new OnPaidEventListener() {
                    @Override
                    public void onPaidEvent(AdValue adValue) {
                        AdEventData adEventData = AdResponseHelper.setDemandWinnerDetails(adValue,
                                "rewarded",
                                mLocation,
                                mRewardedAd.getAdUnitId(),
                                mRewardedAd.getResponseInfo());
                        mAdImpressionListener.onAdImpression(adEventData);
                    }
                });
                sRewardedAd.onAdLoaded();
                Log.i(TAG, "onAdLoaded");
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                Log.i(TAG, "onAdFailedToLoad" );
                // Handle the error
                Log.e(TAG, loadAdError.getMessage());
                Log.e(TAG, String.format("domain: %s, code: %d, message: %s",
                        loadAdError.getDomain(), loadAdError.getCode(), loadAdError.getMessage()));
                sRewardedAd.mAdStatus = AdStatus.NotAvailable;
                sRewardedAd.onLoadFailed();
            }
        });
    }
    private void clearRewardedAd() {
        if (mRewardedAd != null) {
            mRewardedAd.setOnPaidEventListener(null);
            mRewardedAd.setFullScreenContentCallback(null);
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
