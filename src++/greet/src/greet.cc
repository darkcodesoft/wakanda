#include "greet.h"
#include <napi.h>
#include <stdio.h>
#include <stdlib.h>

using namespace std;

/**
 *
 */
std::string Greet::hello()
{
    int number1 = 1000;
    int number2 = 3333;

    string message = std::to_string(number1 - number2);

    return message;
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