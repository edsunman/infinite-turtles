uniform sampler2D map;
varying vec2 vUv;
varying float vCustom;

#include <color_pars_fragment>

void main() {

    vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 texture = texture2D(map, vUv);

    float mixAmount = 0.0;

    #if defined( USE_COLOR )

    mixAmount = vColor.r;

    #endif

    gl_FragColor = mix(texture, red, mixAmount);

    #include <colorspace_fragment> 
}