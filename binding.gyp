{
    "targets": [{
        "target_name": "greet",
        "cflags!": ["-fno-exceptions"],
        "cflags_cc!": ["-fno-exceptions"],
        "sources": [
            "src++/greet/*.cc",
            "src++/greet/src/*.cc"
        ],
        "include_dirs" : [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        "libraries": [],
        "dependencies": [
            "<!(node -p \"require('node-addon-api').gyp\")"
        ],
        "defines": ['NAPI_DISABLE_CPP_EXCEPTIONS']
    }]
}
