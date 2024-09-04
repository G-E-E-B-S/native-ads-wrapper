#include "js_listener_base.h"

void JSListenerBase::setJSDelegate(const se::Value &jsDelegate)
{
    _JSDelegate.setObject(jsDelegate.toObject(), true);
}

const se::Value &JSListenerBase::getJSDelegate()
{
    return _JSDelegate;
}

void JSListenerBase::invokeJSFun(const std::string &funName, const se::ValueArray &params)
{
    for (int i = 0; i < params.size(); i++)
    {
        const se::Value &param = params.at(i);
        if (param.isObject())
        {
            param.toObject()->root();
        }
    }

    cocos2d::Application::getInstance()->getScheduler()->performFunctionInCocosThread([funName, params, this]()
                                                                                      { this->invokeJSFunNow(funName, params); });
}

void JSListenerBase::invokeJSFunNow(const std::string &funName, const se::ValueArray &params)
{
    se::ScriptEngine::getInstance()->clearException();
    se::AutoHandleScope hs;
    if (!_JSDelegate.isObject())
        return;

    se::Value func;
    _JSDelegate.toObject()->getProperty(funName.c_str(), &func);

    if (func.isObject() && func.toObject()->isFunction())
    {
        bool ok = func.toObject()->call(params, _JSDelegate.toObject());
        if (!ok)
        {
            se::ScriptEngine::getInstance()->clearException();
        }
    }
    for (int i = 0; i < params.size(); i++)
    {
        const se::Value &param = params.at(i);
        if (param.isObject())
        {
            param.toObject()->unroot();
        }
    }
}
