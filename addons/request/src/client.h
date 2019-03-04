#ifndef REQUEST_CLIENT_H_
#define REQUEST_CLIENT_H_

#include <napi.h>
#include <string>
#include "clientUnWrapped.h"

using namespace std;

class Client : public Napi::ObjectWrap<Client>
{
public:
  Client(const Napi::CallbackInfo &info);
  static Napi::Object Init(Napi::Env env, Napi::Object exports);

private:
  static Napi::FunctionReference constructor;
  Napi::Value Request(const Napi::CallbackInfo &info);
  ClientUnWrapped *clientUnWrapped_;
};

#endif // REQUEST_CLIENT_H_