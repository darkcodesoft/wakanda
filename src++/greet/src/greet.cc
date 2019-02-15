#include "greet.h"
#include <napi.h>

/**
 *
 */
std::string Greet::hello()
{
    return "Hello..";
}

/**
 *
 */
Napi::String Greet::helloWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    return Napi::String::New(env, Greet::hello());
}

/**
 *
 */
Napi::Object Greet::init(Napi::Env env, Napi::Object exports)
{
    exports.Set("hello", Napi::Function::New(env, Greet::helloWrapped));
    return exports;
}