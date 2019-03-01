#include <napi.h>
#include <iostream>
#include "src/client.h"

/**
* Define addon entry point (kinda int main() function in class c++)
* @param Napi::Env env the context that needs to be passed
* @param Napi::Object exports the object used to set the exported functions and classes via N-API
* @return Napi::Object
*/
Napi::Object initAll(Napi::Env env, Napi::Object exports)
{
    return Client::Init(env, exports);
}

/**
* Export addon for Nodejs
* @param name must match the target name in the bidding.gyp file
* @param function Points to function invoke when the addon is loaded. This function must not be namespaced.
*/
NODE_API_MODULE(request, initAll);
