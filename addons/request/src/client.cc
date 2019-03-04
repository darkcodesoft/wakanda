#include <napi.h>
#include "client.h"

/**
 * Declare reference to constructor
 */
Napi::FunctionReference Client::constructor;

/**
 * Implements Napi::Object Init function to wrap function to be exported
 * @param Napi::Env env object
 * @param Napi::Object exports object
 * @returns Napi::Object exports
 */
Napi::Object Client::Init(Napi::Env env, Napi::Object exports)
{
    Napi::HandleScope scope(env);

    Napi::Function func = DefineClass(env, "Client", {InstanceMethod("request", &Client::Request)});
    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();

    exports.Set("Client", func);

    return exports;
}

/**
 * Client class wrapper function
 * @param Napi::CallbackInfo bridge info object reference
 * @returns Napi::ObjectWrap<Client>(info)
 */
Client::Client(const Napi::CallbackInfo &info) : Napi::ObjectWrap<Client>(info)
{
    Napi::Env env = info.Env();
    Napi::HandleScope scope(env);
    this->clientUnWrapped_ = new ClientUnWrapped;
}

/**
 * Client::Request function wrapper function
 * @param Napi::CallbackInfo reference
 * @returns Napi::Value
 */
Napi::Value Client::Request(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::HandleScope scope(env);

    if (info.Length() != 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "String expected").ThrowAsJavaScriptException();
    }

    Napi::String url = info[0].As<Napi::String>();
    string result = this->clientUnWrapped_->request(url);

    return Napi::String::New(info.Env(), result);
}