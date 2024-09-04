package com.wrapper.admob;

import com.wrapper.AdEventData;
import com.google.android.gms.ads.AdValue;
import com.google.android.gms.ads.AdapterResponseInfo;
import com.google.android.gms.ads.ResponseInfo;

public class AdResponseHelper {
    public static AdEventData setDemandWinnerDetails(AdValue adValue,
                                              String type,
                                              String location,
                                              String adUnitId,
                                              ResponseInfo responseInfo) {
        AdEventData eventData = new AdEventData();
        eventData.platform = "AdMob";
        eventData.type = type;
        eventData.location = location;
        eventData.currencyCode = adValue.getCurrencyCode();
        eventData.revenue = adValue.getValueMicros()/1000000.0;
        eventData.unitId = adUnitId;
        eventData.precision = adValue.getPrecisionType();
        AdapterResponseInfo loadedAdapterResponseInfo = responseInfo.getLoadedAdapterResponseInfo();
        if (loadedAdapterResponseInfo != null) {
            String adapterClassName = loadedAdapterResponseInfo.getAdapterClassName();
            switch (adapterClassName) {
                case "com.google.ads.mediation.facebook.FacebookMediationAdapter":
                    setDataForFacebook(eventData, loadedAdapterResponseInfo);
                    break;
                case "com.google.ads.mediation.ironsource.IronSourceAdapter":
                case "com.google.ads.mediation.ironsource.IronSourceRewardedAdapter":
                    setDataForIronSrc(eventData, loadedAdapterResponseInfo);
                    break;
                case "com.google.ads.mediation.unity.UnityAdapter":
                case "com.google.ads.mediation.unity.UnityMediationAdapter":
                    setDataForUnity(eventData, loadedAdapterResponseInfo);
                    break;
                case "com.google.ads.mediation.admob.AdMobAdapter":
                    setDataForAdmob(eventData, loadedAdapterResponseInfo);
                    break;
                default:
                    eventData.networkName = adapterClassName;
                    break;
            }
        } else {
            eventData.networkName = responseInfo.getMediationAdapterClassName();
        }
        return eventData;
    }
    private static void setDataForFacebook(AdEventData eventData, AdapterResponseInfo loadedAdapterResponseInfo) {
        eventData.networkName = loadedAdapterResponseInfo.getAdSourceName();
        eventData.placementId = loadedAdapterResponseInfo.getCredentials().getString("placement_id");
    }
    private static void setDataForAdmob(AdEventData eventData, AdapterResponseInfo loadedAdapterResponseInfo) {
        eventData.networkName = loadedAdapterResponseInfo.getAdSourceName();
        eventData.placementId = loadedAdapterResponseInfo.getAdSourceId();
    }
    private static void setDataForIronSrc(AdEventData eventData, AdapterResponseInfo loadedAdapterResponseInfo) {
        eventData.networkName = loadedAdapterResponseInfo.getAdSourceName();
    }
    private static void setDataForUnity(AdEventData eventData, AdapterResponseInfo loadedAdapterResponseInfo) {
        eventData.networkName = loadedAdapterResponseInfo.getAdSourceName();
    }
}
