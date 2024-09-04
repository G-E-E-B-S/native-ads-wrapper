package com.wrapper;

public class AdEventData {
    /**
     * Mediation network name
     */
    public String platform;
    /**
     * Revenue currency code
     */
    public String currencyCode;
    public double revenue;
    public String location;
    public String networkName;
    public String type;
    public String placementId;
    public String placementName;
    public String unitId;
    public int precision;

    @Override
    public String toString() {
        return "AdEventData{" +
                "platform='" + platform + '\'' +
                ", currencyCode='" + currencyCode + '\'' +
                ", revenue=" + revenue +
                ", location='" + location + '\'' +
                ", networkName='" + networkName + '\'' +
                ", type='" + type + '\'' +
                ", placementId='" + placementId + '\'' +
                ", placementName='" + placementName + '\'' +
                ", unitId='" + unitId + '\'' +
                ", precision=" + precision +
                '}';
    }
}
