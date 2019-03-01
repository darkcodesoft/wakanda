#ifndef REQUEST_CLIENT_UNWRAPPED_H_
#define REQUEST_CLIENT_UNWRAPPED_H_

#include <stdio.h>
#include <napi.h>
using namespace std;

class ClientUnWrapped
{
public:
  ClientUnWrapped();
  std::string request(std::string url);

private:
  static size_t handler(char *buf, size_t size, size_t nmemb, void *up);
};

#endif // REQUEST_CLIENT_UNWRAPPED_H_
