varying vec2 vUv;
uniform vec3 u_color;
uniform int u_patternId;
varying float vPatternId;


void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float d = length(coord);
    float alpha = 1.0;
    float a = atan(coord.y, coord.x);
    int pattern = int(vPatternId ); // float → int に変換

    if(pattern == 0) {
        // ドーナツ
        if(d < 0.2 || d > 0.4)
            discard;

    } else if(pattern == 1) {
        // 星形風
        float r = abs(sin(5.0 * a));
        if(d > 0.5 * r)
            discard;

    } else if(pattern == 2) {
        // 丸いグラデーション
        alpha = smoothstep(0.5, 0.0, d);
        if(alpha < 0.1)
            discard;

    } else if(pattern == 3) {
        // 十字形
        if(!(abs(coord.x) < 0.1 || abs(coord.y) < 0.1))
            discard;

    } else if(pattern == 4) {
        // 四角の囲み
        if(abs(coord.x) < 0.3 && abs(coord.y) < 0.3)
            discard;

    } else if(pattern == 5) {
        // クロス＋四角の囲み
        if(!(abs(coord.x) < 0.1 || abs(coord.y) < 0.1 || abs(coord.x) > 0.3 || abs(coord.y) > 0.3))
            discard;

    } else if(pattern == 6) {
        // スパイラル風
        float r = length(coord);
        float theta = atan(coord.y, coord.x);
        if(fract((theta + r * 8.0) / 6.28) > 0.1)
            discard;

    } else if(pattern == 7) {
        // スクエアピクセル風
        if(mod(floor(coord.x * 20.0), 2.0) == mod(floor(coord.y * 20.0), 2.0))
            discard;

    } else if(pattern == 8) {
        // ハート風（ラフ）
        float x = coord.x * 2.0;
        float y = coord.y * 2.0;
        float heart = pow(x * x + y * y - 1.0, 3.0) - x * x * y * y * y;
        if(heart > 0.0)
            discard;

    } else if(pattern == 9) {
        // 三角形風
        if(coord.y < -0.25 || coord.x < coord.y - 0.1 || coord.x > -coord.y + 0.1)
            discard;

    } else if(pattern == 10) {
        // 波模様
        if(abs(sin(coord.x * 20.0) * 0.2) < abs(coord.y))
            discard;

    } else if(pattern == 11) {
        // 水玉ドット（小）
        if(mod(floor(coord.x * 10.0) + floor(coord.y * 10.0), 2.0) < 1.0 && d > 0.1)
            discard;

    } else if(pattern == 12) {
        // 四角ドット（粗）
        if(abs(coord.x) > 0.3 || abs(coord.y) > 0.3)
            discard;

    } else if(pattern == 13) {
        // ランダムノイズ風（疑似）
        float noise = fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
        if(noise < 0.4)
            discard;

    } else if(pattern == 14) {
        // ピラミッド風
        if(abs(coord.x) > 0.5 - abs(coord.y))
            discard;

    } else if(pattern == 15) {
        // 丸と十字の合成
        if(d > 0.4 && !(abs(coord.x) < 0.1 || abs(coord.y) < 0.1))
            discard;

    } else if(pattern == 16) {
        // 四角と三角の合成
        if(!(abs(coord.x) < 0.3 || (coord.y > -0.3 && coord.x > coord.y - 0.1 && coord.x < -coord.y + 0.1)))
            discard;

    } else if(pattern == 17) {
        // ライン風格子
        if(mod(floor(coord.x * 10.0), 2.0) == 0.0 && mod(floor(coord.y * 10.0), 2.0) == 0.0)
            discard;

    } else if(pattern == 18) {
        // クローバー風（シンプル）
        float r = length(coord);
        float angle = atan(coord.y, coord.x);
        float petal = sin(4.0 * angle);
        if(r > 0.4 * abs(petal))
            discard;

    } else if(pattern == 19) {
        // 八芒星風
        float r = abs(sin(8.0 * a));
        if(d > 0.5 * r)
            discard;
    }
    
    gl_FragColor = vec4(u_color, 1.0);
}