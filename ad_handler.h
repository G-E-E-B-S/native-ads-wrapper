#ifndef AD_HANDLER_H
#define AD_HANDLER_H

#include <string>
#include <memory>
class IAdImplementation {
public:
    virtual void registerPlacement(const std::string& placementName, const std::string& placementId) = 0;
    virtual void load(const std::string& placementName) = 0;
    virtual void show(const std::string& placementName, const std::string& location) = 0;
    virtual bool isAdLoaded() = 0;
    virtual bool isAdAvailable() = 0;
};
#endif // AD_HANDLER_H
