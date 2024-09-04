package com.wrapper.admob;

import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;

import com.wrapper.AdEventData;
import com.wrapper.IAdImpressionListener;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdValue;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.AdapterResponseInfo;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.OnPaidEventListener;
import com.google.android.gms.ads.ResponseInfo;

public class BannerAdImplementation extends AdListener {
    private static String TAG = "BannerAdImplementation";
    private static BannerAdImplementation sBannerAd;
    private ConstraintLayout mView;
    private AdView mAdView;
    private Activity mActivity;
    private AdStatus mAdStatus;
    private String mLocation;
    private IAdImpressionListener mAdImpressionListener;

    public BannerAdImplementation(ConstraintLayout view, Activity activity, IAdImpressionListener adImpressionListener) {
        mView = view;
        mActivity = activity;
        mAdStatus = AdStatus.NotAvailable;
        sBannerAd = this;
        mAdImpressionListener = adImpressionListener;
    }

    public static void setup() {
    }

    public static void show(final String placementName, String location) {
        sBannerAd.mLocation = location;
        sBannerAd.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (sBannerAd.mAdView != null) {
                    return;
                }
                sBannerAd.mAdStatus = AdStatus.Loading;
                AdRequest adRequest = new AdRequest.Builder().build();
                Activity activity = sBannerAd.mActivity;
                AdView view = new AdView(activity);
                view.setAdSize(AdSize.BANNER);
                view.setAdUnitId(placementName);
                view.loadAd(adRequest);
                view.setAdListener(sBannerAd);
                view.setId(View.generateViewId());
                sBannerAd.mAdView = view;
                view.setOnPaidEventListener(new OnPaidEventListener() {
                    @Override
                    public void onPaidEvent(@NonNull AdValue adValue) {
                        AdEventData eventData = AdResponseHelper.setDemandWinnerDetails(adValue,
                                "banner",
                                sBannerAd.mLocation,
                                sBannerAd.mAdView.getAdUnitId(),
                                sBannerAd.mAdView.getResponseInfo());
                        sBannerAd.mAdImpressionListener.onAdImpression(eventData);
                    }
                });
            }
        });
    }

    public static void load(final String placementName) {
    }

    public static void hide() {
        sBannerAd.mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (sBannerAd.mAdView != null) {
                    AdView adView = sBannerAd.mAdView;
                    ViewParent parent = adView.getParent();
                    if (parent != null) {
                        ((ViewGroup) parent).removeView(adView);
                    }
                    adView.setAdListener(null);
                    adView.destroy();
                    sBannerAd.mAdView = null;
                }
            }
        });

    }

    @Override
    public void onAdLoaded() {
        mAdStatus = AdStatus.Loaded;
        AdView adView = sBannerAd.mAdView;
        ConstraintLayout parent = sBannerAd.mView;
        parent.addView(adView);
        ViewGroup.LayoutParams params = adView.getLayoutParams();
        params.width = ViewGroup.LayoutParams.MATCH_PARENT;
        params.height = ViewGroup.LayoutParams.WRAP_CONTENT;
        adView.setLayoutParams(params);
        ConstraintSet set = new ConstraintSet();
        set.clone(parent);
        set.connect(adView.getId(), ConstraintSet.BOTTOM, ConstraintSet.PARENT_ID, ConstraintSet.BOTTOM, 0);
        set.applyTo(parent);
        onLoaded();
        // Code to be executed when an ad finishes loading.
    }

    @Override
    public void onAdFailedToLoad(LoadAdError loadAdError) {
        mAdStatus = AdStatus.NotAvailable;
        Log.e(TAG, loadAdError.getMessage());
        Log.e(TAG, String.format("domain: %s, code: %d, message: %s",
                loadAdError.getDomain(), loadAdError.getCode(), loadAdError.getMessage()));
        // Code to be executed when an ad request fails.
        onLoadFailed();
    }

    @Override
    public void onAdOpened() {
        // Code to be executed when an ad opens an overlay that
        // covers the screen.
        onScreenPresented();
    }

    @Override
    public void onAdClicked() {
        // Code to be executed when the user clicks on an ad.
        onClicked();
    }

    @Override
    public void onAdClosed() {
        // Code to be executed when the user is about to return
        // to the app after tapping on an ad.
        onScreenDismissed();
    }

    // Callbacks from AppActivity
    public void onPause() {
            if (mAdView == null) {
                return;
            }

            mAdView.pause();
        }

        public void onResume() {
            if (mAdView == null) {
                return;
            }

            mAdView.resume();
        }

        public void onDestroy() {
            if (mAdView == null) {
                return;
            }

            mAdView.destroy();
        }

    private native void onLoaded();

    private native void onLoadFailed();

    private native void onClicked();

    private native void onScreenPresented();

    private native void onScreenDismissed();

    private native void onLeftApplication();
}
