#pragma once
#include <string>

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#include "cocos/scripting/js-bindings/manual/jsb_global.h"

#define MAKE_V8_HAPPY \
se::ScriptEngine::getInstance()->clearException(); \
se::AutoHandleScope hs;

#include "cocos2d.h"
#include "base/CCScheduler.h"
#include "platform/CCApplication.h"
#define RUN_ON_MAIN_THREAD_BEGIN \
auto funcName = __FUNCTION__; \
auto scheduler = cocos2d::Application::getInstance()->getScheduler(); \
scheduler->performFunctionInCocosThread([=](){

#define RUN_ON_MAIN_THREAD_END });

class JSListenerBase
{
public:
    void setJSDelegate(const se::Value &jsDelegate);
    const se::Value &getJSDelegate();

    void invokeJSFun(const std::string &funName, const se::ValueArray &params = se::EmptyValueArray);
    void invokeJSFunNow(const std::string &funName, const se::ValueArray &params = se::EmptyValueArray);

protected:
    se::Value _JSDelegate;
};
