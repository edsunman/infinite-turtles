uniform sampler2D map;
varying vec2 vUv;
varying float vCustom;

// Converts a color from linear light gamma to sRGB gamma
vec4 fromLinear(vec4 linearRGB) {
    bvec3 cutoff = lessThan(linearRGB.rgb, vec3(0.0031308));
    vec3 higher = vec3(1.055) * pow(linearRGB.rgb, vec3(1.0 / 2.4)) - vec3(0.055);
    vec3 lower = linearRGB.rgb * vec3(12.92);

    return vec4(mix(higher, lower, cutoff), linearRGB.a);
}

vec2 myValues[16];

void main() {

    vec2 mapUv = vUv;

    myValues[0] = vec2(0.0, 0.0);
    myValues[1] = vec2(0.25, 0.0);
    myValues[2] = vec2(0.5, 0.0);
    myValues[3] = vec2(0.75, 0.0);
    myValues[4] = vec2(0.0, 0.25);
    myValues[5] = vec2(0.25, 0.25);
    myValues[6] = vec2(0.5, 0.25);
    myValues[7] = vec2(0.75, 0.25);
    myValues[8] = vec2(0.0, 0.5);
    myValues[9] = vec2(0.25, 0.5);
    myValues[10] = vec2(0.5, 0.5);
    myValues[11] = vec2(0.75, 0.5);
    myValues[12] = vec2(0.0, 0.75);
    myValues[13] = vec2(0.25, 0.75);
    myValues[14] = vec2(0.5, 0.75);
    myValues[15] = vec2(0.75, 0.75);

    vec2 coords = vec2((mapUv.x / 4.0) + myValues[int(vCustom + 0.1)].x, (mapUv.y / 4.0) + myValues[int(vCustom + 0.1)].y);

    gl_FragColor = vec4(0.0, 0.0, 0.0, texture2D(map, coords).r);

    //#include <tonemapping_fragment>
    //#include <colorspace_fragment> 
}