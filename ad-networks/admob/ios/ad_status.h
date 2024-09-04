#import <Foundation/Foundation.h>
typedef NS_ENUM(NSInteger, AdStatus) {
    AdStatusNotAvailable,
    AdStatusCreating,
    AdStatusCreated,
    AdStatusNotLoaded,
    AdStatusLoading,
    AdStatusLoaded,
    AdStatusShowing
};
