#include <stdio.h>
#include <curl/curl.h>

#include "clientUnWrapped.h"

/**
 * Cosntructor
 * @returns ClientUnWrapped instance
 */
ClientUnWrapped::ClientUnWrapped()
{
}

/**
 * Defines ClientUnWrapped::handler parse response stream
 * @param char* buffer buffer object
 * @param size_t size buffer size
 * @param  size_t nmemb
 * @void userp
 * @returns size_t reponse data
 */
size_t ClientUnWrapped::handler(char *buf, size_t size, size_t nmemb, void *userp)
{
    ((std::string *)userp)->append((char *)buf, size * nmemb);
    return size * nmemb;
}

/**
 * Defines ClientUnWrapped::request function
 * @param string url
 * @returns std::string
 */
std::string ClientUnWrapped::request(std::string url)
{
    CURL *curl;
    std::string responseBuffer;
    char errorBuffer[CURL_ERROR_SIZE];
    char errorMessageBuffer[CURL_ERROR_SIZE];

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, ClientUnWrapped::handler);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseBuffer);
    curl_easy_setopt(curl, CURLOPT_ERRORBUFFER, &errorBuffer);
    curl_easy_setopt(curl, CURLOPT_VERBOSE, 1); // for debug
    curl_easy_setopt(curl, CURLOPT_FAILONERROR, true);

    CURLcode code = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    curl_global_cleanup();

    if (code == CURLE_OK)
    {
        return responseBuffer;
    }
    else
    {
        sprintf(errorMessageBuffer, "{\"error\": { \"code\": %u, \"message\": \"%s\" }}", code, errorBuffer);
        return errorMessageBuffer;
    }
}