Pod::Spec.new do |spec|
  spec.name         = "native-ads"
  spec.version      = "0.0.1"
  spec.summary      = "Firebase Auth wrapper for iOS/Android projects"
  spec.description  = <<-DESC
  Firebase Auth wrapper for iOS/Android projects.
  Supports following login methods:
  Apple
  Facebook
  Facebook Gaming
  Google Sign In
                        DESC
  spec.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  spec.platform     = :ios
  spec.ios.deployment_target = "12.0"
  spec.source       = { :git => "https://github.com/G-E-E-B-S/native-ads-wrapper.git", :tag => "#{spec.version}" }
  spec.static_framework = true
  spec.source_files  = [
    "ad_handler.h",
    "BannerAd",
    "Interstitial",
    "RewardedInterstitialVideo",
    "RewardedVideo",
    "ad-networks/admob/ios/*",
    "ad-networks/admob/*.h"]
  spec.pod_target_xcconfig = {
    "HEADER_SEARCH_PATHS" => '"${PODS_ROOT}/ad-networks/admob/ios"'
  }
end
