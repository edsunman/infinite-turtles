varying vec2 vUv;
uniform sampler2D textures[2];
uniform sampler2D blendTexture;
uniform float colors[9];
uniform float noiseOffset;
uniform float useNoise;
uniform float useColors;
uniform float repeat;

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float normalise(float value, float min, float max) {
    return (value - min) / (max - min);
}

float clampNoise(float noiseTex, float clampAmount, float blurAmount) {
    float clampedNoise = (noiseTex > clampAmount) ? 1.0 : 0.0;
    clampedNoise += (noiseTex > clampAmount - blurAmount && noiseTex < clampAmount) ? normalise(noiseTex, clampAmount - blurAmount, clampAmount) : 0.0;
    return clampedNoise;
}

void main() {

    float scale = sin(noiseOffset) * 0.05 + 0.4;
    float noiseScale = 80.0;

    float blurAmount = 0.01;

    vec2 uv = vUv;
    uv = uv * repeat;
    vec2 center = (1.0 - scale) * (vUv - 0.5) + 0.5;
    vec2 smaller = 2.2 * (vUv - 0.5) + 0.5;

    vec4 blendMap = texture2D(textures[0], center);
    vec4 backgroundImage = texture2D(textures[1], vec2(smaller.x, smaller.y + 0.43));

    vec4 color1 = vec4(0.36, 0.22, 0.67, 1.0);
    vec4 color2 = vec4(0.71, 0.61, 0.51, 1.0);
    vec4 color3 = vec4(0.24, 0.13, 0.44, 1.0);
    vec4 color4 = vec4(0.68, 0.56, 0.45, 1.0);

    // blend background texture colors

    vec4 backgroundColor = mix(color4, color2, smoothstep(0.00, 1.00, backgroundImage.r));

    // noise 
    float f = snoise(vec3(noiseScale * vUv, noiseOffset));
    f = 1.5 + 0.3 * f;

    float clampAmount = 0.49;
    float noiseFloat = clampNoise(f * blendMap.r + 0.1, clampAmount, blurAmount);
    float noiseFloat2 = clampNoise(f * blendMap.r - 0.05, clampAmount, blurAmount);

    vec4 layer1 = mix(color1, color3, smoothstep(0.00, 1.00, noiseFloat));
    vec4 layer2 = mix(color3, backgroundColor, smoothstep(0.00, 1.00, noiseFloat2));

    vec4 finalOutput = mix(layer1, layer2, smoothstep(0.00, 1.00, noiseFloat));

    gl_FragColor = finalOutput;

 //   #include <tonemapping_fragment>
//    #include <colorspace_fragment> 
}