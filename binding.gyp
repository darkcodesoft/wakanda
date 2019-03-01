{
    "targets": [
        {
            "target_name": "request",
            "cflags!": ["-fno-exceptions", "-std=c++14"],
            "cflags_cc!": ["-fno-exceptions", "-std=c++14"],
            "cflags": [ "-std=c++14" ],
            'xcode_settings': {
                'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                'CLANG_CXX_LIBRARY': 'libc++',
                'MACOSX_DEPLOYMENT_TARGET': '10.14',
            },
            "sources": [
                "addons/request/main.cc",
                "addons/request/src/client.cc",
                "addons/request/src/clientUnWrapped.cc"
            ],
            "include_dirs" : [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "libraries": ["-lcurl"],
            "dependencies": [
                "<!(node -p \"require('node-addon-api').gyp\")"
            ],
        }
    ]
}
