uniform sampler2D map;
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying float vCustom;

// prob best to hard code this for now
float offset = 0.3;

// Converts a color from linear light gamma to sRGB gamma
vec4 fromLinear(vec4 linearRGB) {
    bvec3 cutoff = lessThan(linearRGB.rgb, vec3(0.0031308));
    vec3 higher = vec3(1.055) * pow(linearRGB.rgb, vec3(1.0 / 2.4)) - vec3(0.055);
    vec3 lower = linearRGB.rgb * vec3(12.92);

    return vec4(mix(higher, lower, cutoff), linearRGB.a);
}

vec2 parallaxMap(in vec3 V) {
    // use bump map
    // float initialHeight = texture2D(bumpMap, vUv).r;
    vec2 texCoordOffset = offset * V.xy; // * initialHeight
    return vUv - texCoordOffset;

}

vec2 perturbUv(vec3 surfPosition, vec3 surfNormal, vec3 viewPosition) {
    vec2 texDx = dFdx(vUv);
    vec2 texDy = dFdy(vUv);
    vec3 vSigmaX = dFdx(surfPosition);
    vec3 vSigmaY = dFdy(surfPosition);
    vec3 vR1 = cross(vSigmaY, surfNormal);
    vec3 vR2 = cross(surfNormal, vSigmaX);
    float fDet = dot(vSigmaX, vR1);
    vec2 vProjVscr = (1.0 / fDet) * vec2(dot(vR1, viewPosition), dot(vR2, viewPosition));
    vec3 vProjVtex;
    vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;
    vProjVtex.z = dot(surfNormal, viewPosition);
    return parallaxMap(vProjVtex);
}

vec2 myValues[7];

void main() {

    vec2 mapUv = perturbUv(-vViewPosition, normalize(vNormal), normalize(vViewPosition));

    myValues[0] = vec2(0.0, 0.0);
    myValues[1] = vec2(0.333, 0.0);
    myValues[2] = vec2(0.666, 0.0);
    myValues[3] = vec2(0.0, 0.333);
    myValues[4] = vec2(0.333, 0.333);
    myValues[5] = vec2(0.666, 0.333);
    myValues[6] = vec2(0.0, 0.666);

    vec2 coords = vec2((mapUv.x / 4.0 + 0.04) + myValues[int(vCustom + 0.1)].x, (mapUv.y / 4.0 + 0.04) + myValues[int(vCustom + 0.1)].y);
    vec4 tex = texture2D(map, coords);

    gl_FragColor = fromLinear(tex);

    //#include <tonemapping_fragment>
    //#include <colorspace_fragment> 
}