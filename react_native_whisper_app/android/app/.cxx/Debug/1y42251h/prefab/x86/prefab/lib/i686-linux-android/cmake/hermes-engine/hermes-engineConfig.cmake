if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/vikas/.gradle/caches/8.14/transforms/83bf45517501cf758e2a335f1db3f7b5/transformed/hermes-android-0.79.5-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/vikas/.gradle/caches/8.14/transforms/83bf45517501cf758e2a335f1db3f7b5/transformed/hermes-android-0.79.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

