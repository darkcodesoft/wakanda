#ifndef GREET__H_
#define GREET__H_

#include <napi.h>

namespace Greet
{
std::string hello();

Napi::String helloWrapped(const Napi::CallbackInfo &info);

Napi::Object init(Napi::Env env, Napi::Object exports);
} // namespace Greet

#endif // !GREET_GREET_H_