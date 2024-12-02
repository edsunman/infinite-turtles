varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 transformedNormal = normal;

    #ifdef USE_INSTANCING

    mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    mat3 im = mat3(instanceMatrix);
    transformedNormal /= vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
    transformedNormal = im * transformedNormal;

    #endif

    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * transformedNormal);

    gl_Position = projectionMatrix * mvPosition;
}
