varying vec2 vUv;
uniform float u_size;
attribute float patternId;
varying float vPatternId;

void main() {
    vUv = uv;
    vPatternId = patternId;
    gl_PointSize = u_size; // ドットサイズ
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}