uniform sampler2D u_texture;
uniform float u_opacity;
uniform float u_time;
uniform float wheelPow;
varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
vec2 segmentID(vec2 uv, float scale) {
    return floor(uv * scale);
}

void main() {

    /*

    BLOCK

    --------------------------------------------------------------------*/
    float scale = 400.0 ;
    vec2 id = segmentID(vUv, scale);
    float angle = hash(id) * 6.14; // 2π
    float dist = (hash(id * 2.3 * 0.2) - 0.5) * 0.05 ;
    vec2 offset = vec2(cos(angle), sin(angle)) * dist;
    vec4 texColor = texture2D(u_texture, vUv + offset * (1.0 - u_opacity));
    gl_FragColor = vec4(texColor.rgb, texColor.a * u_opacity);
    
    // float scale = 100.0;
    // vec2 id = segmentID(vUv, scale);
    // float angle = hash(id) * 6.14; // 2π
    // float dist = (hash(id * 2.3 * 0.2) - 0.5) * 0.1 * u_time ;
    // vec2 offset = vec2(cos(angle ), sin(angle)) * dist;
    // vec4 texColor = texture2D(u_texture, vUv + offset);
    // gl_FragColor = vec4(texColor.rgb, texColor.a);
    



    /*

    すりガラス

    --------------------------------------------------------------------*/
    // float noiseX = random(vUv + vec2(u_time * 0.01, u_time * 0.01));
    // float noiseY = random(vUv + vec2(u_time * 0.01, u_time * 0.01));

    // vec2 warpedUV = vUv;
    // warpedUV.x += sin((noiseX - 0.5) * (0.1 * (1. - 0.)));
    // // warpedUV.y += tan((noiseY - 0.5) * (0.1 * (1. - 0.)));
    

    // vec4 texColor = texture2D(u_texture, warpedUV);
    // gl_FragColor = vec4(texColor.rgb, texColor.a * u_opacity);
}