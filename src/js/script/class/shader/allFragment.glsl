uniform sampler2D tDiffuse;
uniform float u_time;
uniform float u_resolution;
varying vec2 vUv;

// シンプルなノイズ関数（代用）
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}
// uvを複数領域に分割して、領域ごとに歪ませる
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 segmentID(vec2 uv, float scale) {
    vec2 gv = fract(uv * scale); // グリッド内の位置
    vec2 id = floor(uv * scale); // セルID
    return id;
}
vec2 segmentIDTATE(vec2 uv, float scale) {
    return vec2(0.0, floor(uv.x * scale)); // ← Y方向だけ分割
}

void main() {
    /*

    残しておきたい

    --------------------------------------------------------------------*/
    // 時間で動くノイズ
    // float noiseX = random(vUv + vec2(u_time * 0.5, u_time * 1.5));
    // float noiseY = random(vUv + vec2(u_time * 2.3, u_time * 0.7));
    // vec2 warpedUV = vUv;
    // warpedUV.x += (noiseX - 0.5) * 0.01;
    // warpedUV.y += (noiseY - 0.5) * 0.01;
    // // warpedUV.y += sin(u_time + vUv.x * 10.0) * 0.1;
    // // warpedUV.x -= cos(u_time + vUv.x * 10.0) * 0.1;
    // vec4 color = texture2D(tDiffuse, warpedUV);
    // gl_FragColor = vec4(color.rgb, color.a);

    /*

    残しておきたい

    --------------------------------------------------------------------*/
    // vec2 uv = vUv;
    // vec2 center = vec2(0.5);
    // vec2 toCenter = uv - center;
    // float dist = length(toCenter);
    // float angle = atan(toCenter.y, toCenter.x);
    // float swirlAmount = 1.0 * (1.0 - dist); // 中心ほど強く
    // angle += sin(u_time + dist * 10.0) * swirlAmount;

    // vec2 warped = vec2(cos(angle), sin(angle)) * dist + center;
    // vec4 color = texture2D(tDiffuse, warped);
    // gl_FragColor = vec4(color.rgb, color.a);

    /*

    何もなし

    --------------------------------------------------------------------*/
    vec2 warpedUV = vUv;
    vec4 color = texture2D(tDiffuse, warpedUV);
    gl_FragColor = vec4(color.rgb, color.a);    

    /*

    横にnoise

    --------------------------------------------------------------------*/
    // vec2  uv              = vUv;
    // float glitchStrength  = 0.05;
    // float offset          = step(0.1, fract(sin(u_time * 20.1 + uv.y * 50.0) * 43758.5453)) * glitchStrength;
    //       uv.x           += offset;
    // float n     = random(vec2(uv.y * 140.0, u_time));
    //       uv.x += (n - 0.1) * glitchStrength;
    // vec4 color        = texture2D(tDiffuse, uv);
    // gl_FragColor = vec4(color.rgb, color.a);

    /*

    分割

    --------------------------------------------------------------------*/
    // vec2 uv = vUv;
    // float scale = 500.0;
    // vec2 id = segmentID(uv, scale);
    // float angle = hash(id ) * 6.2831;
    // float dist = (hash(id * 2.3  * 0.2) - 0.5) * 0.05;
    // vec2 offset = vec2(sin(angle * u_time), sin(angle *  u_time)) * dist;
    // vec4 color = texture2D(tDiffuse, uv + offset);
    // gl_FragColor = color;

    // コマ送り
    // float scale = 50.0;
    // float id = floor(vUv.x * scale);

    // float stepTime = 0.1; // コマ送り1コマの長さ
    // float delay = id * stepTime;
    // float t = max(0.0, u_time - delay);
    // float steppedTime = floor(t / stepTime) * stepTime;

    // float angle = hash(vec2(id, 0.0)) * 6.2831;
    // float dist = (hash(vec2(id * 1.23, 0.0)) - 0.5) * 0.05;
    // vec2 offset = vec2(angle, angle) ;
    // vec4 color = texture2D(tDiffuse, vUv + offset * step(t, 0.0)); // stepで一気に出すようにも可

    // gl_FragColor = color;

    /*

    分割

    --------------------------------------------------------------------*/
    // vec2 uv = vUv;
    // float scale = 48.0;
    // vec2 id = segmentIDTATE(uv, scale);
    // float angle = hash(id) * 6.2831;
    // float dist = (hash(id * 2.3 * 0.2) - 0.5) * 0.05;
    // vec2 offset = vec2(sin(angle * u_time), sin(angle * u_time)) * dist;
    // vec4 color = texture2D(tDiffuse, uv + offset);
    // gl_FragColor = color;

    /*

    色の差でぼかし

    --------------------------------------------------------------------*/
    
    // vec2 texel = vec2(1.0) / u_resolution;
    // vec4 color = vec4(0.0);
    // float total = 0.0;

    // for(int x = -4; x <= 4; x++) {
    //     for(int y = -4; y <= 4; y++) {
    //         vec2 id = floor(vUv * 80.0); // 粒度を粗く
    //         float chaos = hash(id) * 0.05;
    //         vec2 offset = vec2(float(x), float(y)) * 0.5 * chaos;
            
    //         float dist = length(vec2(x, y));
    //         float weight = max(0.0, 1.0 - dist / 5.7); // ← ここが重要！
    //         color += texture2D(tDiffuse, vUv + offset) * weight;
    //         total += weight;
    //     }
    // }

    // gl_FragColor = color / total;
}