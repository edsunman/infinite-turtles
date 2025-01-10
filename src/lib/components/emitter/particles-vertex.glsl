attribute float sizeRandom;
attribute float rotation;
attribute float colorRandom;
attribute float lightnessRandom;
attribute float life;
attribute float randomSeed;
attribute vec3 velocity;

uniform float maxLifetime;
uniform float dampen;
uniform vec4 sizeStops;
uniform vec4 sizes;
uniform vec3 gravity;
uniform vec3 wind;
uniform float driftAmount;
uniform float driftSpeed;
uniform float screenPixelRatio;

varying float vColorRandom;
varying float vLightnessRandom;
varying vec2 vRotation;
varying float vNormalLife;
varying float vReverseNormalLife;

// TODO: alow custom easing function
float easeOut(float x) {
    return -x * (x - 2.0);  // quart out

}

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
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
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)
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

void main() {
    // normlised lifetime; 0 = born, 1 - died
    vNormalLife = life / maxLifetime;

    // dampen
    float dampenedLife = vNormalLife;
    if(dampen > 0.0) {
        dampenedLife = easeOut(vNormalLife);
    }

    // drift
    vec3 newPosition = position;
    float noiseAmountX = snoise(vec3(newPosition.x + vNormalLife * driftSpeed * randomSeed, randomSeed, randomSeed)) * driftAmount;
    float noiseAmountY = snoise(vec3(randomSeed, newPosition.y + vNormalLife * driftSpeed * randomSeed, randomSeed)) * driftAmount;
    float noiseAmountZ = snoise(vec3(randomSeed, randomSeed, newPosition.z + vNormalLife * driftSpeed * randomSeed)) * driftAmount;
    newPosition = vec3(newPosition.x + (noiseAmountX * vNormalLife), newPosition.y + (noiseAmountY * vNormalLife), newPosition.z + (noiseAmountZ * vNormalLife));

    // velocity
    newPosition = newPosition + (velocity * dampenedLife);

    // gravity
    vec3 gravityVector = gravity * vNormalLife * vNormalLife;
    newPosition += gravityVector;

    // wind
    newPosition = newPosition + (wind * vNormalLife);

    // calculate screen position
    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // size gradient
    float size = mix(sizes[0], sizes[1], smoothstep(sizeStops.x, sizeStops.y, vNormalLife));
    size = mix(size, sizes[2], smoothstep(sizeStops.y, sizeStops.z, vNormalLife));
    size = mix(size, sizes[3], smoothstep(sizeStops.z, sizeStops.w, vNormalLife));

    // TODO: work out orthagraphic zoom
    gl_PointSize = (size + sizeRandom) * (100.0 / length(mvPosition.xyz)) * screenPixelRatio;

    // set varyings for fragment shader
    vRotation = vec2(cos(life * rotation), sin(life * rotation));
    vColorRandom = colorRandom;
    vLightnessRandom = lightnessRandom;
}