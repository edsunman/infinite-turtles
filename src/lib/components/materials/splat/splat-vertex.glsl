varying vec2 vUv;
varying vec2 vPos;
varying vec3 vNormal;

void main() {

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = uv;
    vPos = position.xy;
    vNormal = normal;
}
