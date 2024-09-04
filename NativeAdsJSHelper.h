#ifndef NATIVE_ADS_JS_HELPER_H
#define NATIVE_ADS_JS_HELPER_H
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"

namespace se {
    class Object;
}

bool register_all_native_ads_JS_helper(se::Object* obj);
#endif // NATIVE_ADS_JS_HELPER_H