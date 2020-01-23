vcl 4.0;
backend default {
    .host = "wapi";
    .port = "3001";
}
sub vcl_recv {
  if (req.method == "GET" && req.url ~ "^/api$") {
    unset req.http.cookie;
  }
}
sub vcl_backend_response {
  if (bereq.method && bereq.url ~ "^/api$") {
    set beresp.ttl = 30s;
    set beresp.uncacheable = false;
  }
  return (deliver);
}
sub vcl_deliver {
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }
}
