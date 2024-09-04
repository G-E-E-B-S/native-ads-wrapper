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
import com.google.android.gms.ads.ResponseInfo;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

public class InterstitialAdImplementation extends FullScreenContentCallback {
    private static InterstitialAdImplementation sInterstialAd;
    private static String TAG = "InterstitialAdImplementation";
    private Activity mActivity;
    private InterstitialAd mInterstitialAd;
    private AdStatus mAdStatus;
    private String mLoadedPlacement;
    private String mLocation;
    private IAdImpressionListener mAdImpressionListener;
    public InterstitialAdImplementation(Activity activity, IAdImpressionListener adImpressionListener) {
        sInterstialAd = this;
        mActivity = activity;
        mAdStatus = AdStatus.NotAvailable;
        mAdImpressionListener = adImpressionListener;
    }
    public static void load(final String placementName) {
        if (sInterstialAd.mAdStatus != AdStatus.NotAvailable) {
            return;
        }
        sInterstialAd.mAdStatus = AdStatus.Loading;
        sInterstialAd.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                sInterstialAd.loadOnUiThread(placementName);
            }
        });
    }
    public static void show(String placementName, String location) {
        sInterstialAd.mLocation = location;
        if (sInterstialAd.mInterstitialAd != null) {
            sInterstialAd.mAdStatus = AdStatus.Showing;
            sInterstialAd.mActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    sInterstialAd.mInterstitialAd.setFullScreenContentCallback(sInterstialAd);
                    sInterstialAd.mInterstitialAd.show(sInterstialAd.mActivity);
                }
            });
        } else {
            Log.d("TAG", "The interstitial ad wasn't ready yet.");
        }
    }
    public static boolean isAdLoaded() {
        return sInterstialAd.mAdStatus == AdStatus.Loaded;
    }
    public static boolean isAdAvailable() {
        return sInterstialAd.mAdStatus == AdStatus.Loaded || sInterstialAd.mAdStatus == AdStatus.Loading;
    }
    @Override
    public void onAdDismissedFullScreenContent() {
        // Called when fullscreen content is dismissed.
        clearAdUnit();
        mAdStatus = AdStatus.NotAvailable;
        Log.d("TAG", "The ad was dismissed.");
        onClosed();
    }

    @Override
    public void onAdFailedToShowFullScreenContent(AdError adError) {
        // Called when fullscreen content failed to show.
        clearAdUnit();
        mAdStatus = AdStatus.NotAvailable;
        Log.d("TAG", "The ad failed to show.");
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
        Log.d("TAG", "The ad was shown.");
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
        mLoadedPlacement = placementName;
        final AdRequest adRequest = new AdRequest.Builder().build();
        InterstitialAd.load(sInterstialAd.mActivity, placementName, adRequest, new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                // The mInterstitialAd reference will be null until
                // an ad is loaded.
                sInterstialAd.mInterstitialAd = interstitialAd;
                interstitialAd.setOnPaidEventListener(new OnPaidEventListener() {
                    @Override
                    public void onPaidEvent(@NonNull AdValue adValue) {
                        ResponseInfo responseInfo = mInterstitialAd.getResponseInfo();
                        AdEventData eventData = AdResponseHelper.setDemandWinnerDetails(adValue,
                                "interstitial",
                                mLocation,
                                mInterstitialAd.getAdUnitId(),
                                responseInfo);
                        mAdImpressionListener.onAdImpression(eventData);
                    }
                });
                sInterstialAd.mAdStatus = AdStatus.Loaded;
                Log.i(TAG, "onAdLoaded");
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                // Handle the error
                Log.e(TAG, loadAdError.getMessage());
                Log.e(TAG, String.format("domain: %s, code: %d, message: %s",
                        loadAdError.getDomain(), loadAdError.getCode(), loadAdError.getMessage()));
                sInterstialAd.mAdStatus = AdStatus.NotAvailable;
                sInterstialAd.clearAdUnit();
                sInterstialAd.onLoadFailed();
            }
        });
    }
    private void clearAdUnit() {
        if (mInterstitialAd != null) {
            mInterstitialAd.setOnPaidEventListener(null);
            mInterstitialAd = null;
        }
    }
    private native void onClosed();
    private native void onShown();
    private native void onLoadFailed();
    private native void onShowFailed();
}
