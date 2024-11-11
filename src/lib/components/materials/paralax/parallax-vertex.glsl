varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    #ifdef USE_INSTANCING
    mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    #endif

    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * mvPosition;
}
