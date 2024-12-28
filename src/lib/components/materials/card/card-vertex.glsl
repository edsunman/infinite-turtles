varying vec2 vUv;
attribute float custom;
varying float vCustom;

#include <batching_pars_vertex>
#include <color_pars_vertex>

void main() {
    #include <batching_vertex>
    #include <color_vertex>

    vUv = uv;
    vCustom = custom;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    #ifdef USE_BATCHING
    mvPosition = modelViewMatrix * batchingMatrix * vec4(position, 1.0);
    #endif

    #ifdef USE_INSTANCING
    mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    #endif

    gl_Position = projectionMatrix * mvPosition;
}
