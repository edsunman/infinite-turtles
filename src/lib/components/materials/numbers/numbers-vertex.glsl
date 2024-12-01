varying vec2 vUv;
attribute float custom;
varying float vCustom;

void main() {
    vUv = uv;
    vCustom = custom;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    #ifdef USE_INSTANCING
    mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
    #endif

    gl_Position = projectionMatrix * mvPosition;
}
