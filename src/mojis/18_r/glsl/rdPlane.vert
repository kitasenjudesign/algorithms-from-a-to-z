varying vec2 vUv;// fragmentShaderに渡すためのvarying変数
void main()
{
    // 処理する頂点ごとのuv(テクスチャ)座標をそのままfragmentShaderに横流しする
    vUv = uv;
    // 変換：ローカル座標 → 配置 → カメラ座標
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);    
    // 変換：カメラ座標 → 画面座標
    gl_Position = projectionMatrix * mvPosition;
}