// "uniform vec2 resolution" is automatically added by GPUComputationRenderer as texture size
      uniform vec2 planeSize;
      vec2 textureSize = resolution;

      bool isInPosCoordRange(in vec2 texCoord) {
        float v = texCoord.x + texCoord.y * textureSize.x;
        return v <= (planeSize.x * planeSize.y);
      }

      float div(in float a, in float b) {
        return floor(a / b);
      }

      float modulo(in float a, in float b) {
        return a - floor(a / b) * b;
      }

      vec2 convertFromTexCoordToPosCoord(in vec2 texCoord) {
        float idx = texCoord.x + texCoord.y * textureSize.x;
        return vec2(modulo(idx, planeSize.x), div(idx, planeSize.x));
      }

      vec2 convertFromPosCoordToTexCoord(in vec2 posCoord) {
        float idx = posCoord.x + posCoord.y * planeSize.x;
        return vec2(modulo(idx, textureSize.x), div(idx, textureSize.x));
      }

      vec4 status(in vec2 offset) {
        vec2 posCoord = convertFromTexCoordToPosCoord(floor(gl_FragCoord.xy)) + offset;

        // boundary condition
        posCoord.x = posCoord.x < 0.0 ? planeSize.x - 1.0 : posCoord.x;
        posCoord.x = posCoord.x > planeSize.x ? 0.0 : posCoord.x;
        posCoord.y = posCoord.y < 0.0 ? planeSize.y - 1.0 : posCoord.y;
        posCoord.y = posCoord.y > planeSize.y ? 0.0 : posCoord.y;

        vec2 texCoord = convertFromPosCoordToTexCoord(posCoord) + fract(gl_FragCoord.xy);
        vec4 op = texture2D(textureLifeGame, texCoord / textureSize.xy);
        op.xy = 2.0*(op.xy-vec2(0.5,0.5)); //xyは、-1 1の範囲に変換

        return op;
      }

      vec4 check(in vec2 offset){

        //場合A：白のマスにやってきたら、そこを黒に変えて、右に進む。
        //場合B：黒のマスにやってきたら、そこを白に変えて、左に進む。
        vec4 col = status(offset);
        vec2 dir = col.xy;

        //0,1と-1,1の問題
        //ああ、ちがう、0,0だと０からなず、どれか１

        if( col.x==0.0 && col.y==0.0 ){

          //両方ゼロのときは実機なし

        }else{
          
          float rad = col.z < 0.5 ? 3.1415/2.0 : -3.1415/2.0;


          col.x = dir.x * cos(rad) - dir.y * sin(rad);
          col.y = dir.x * sin(rad) + dir.y * cos(rad);
          col.x = sign(col.x) * step(0.5,abs(col.x));
          col.y = sign(col.y) * step(0.5,abs(col.y));

          if(col.x == -offset.x && col.y == -offset.y){
            
          }else{
            //実機はいたけど中心セルには移動してこない
            col.x=0.0;
            col.y=0.0;
          }

        }

        return col;
      }

      void main() {

        // checks whether current position is used or not
        if (!isInPosCoordRange(floor(gl_FragCoord.xy))) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
          return;
        }


        vec4 center = status(vec2(0.0, 0.0));
        //0 0.5 1 = -1 0 1の意味とする
        vec4 op = center;//vec4(0.0,0.0,0.0,1.0);

        if(center.x==0.0 && center.y==0.0){//両方ゼロ＝実機なし

          vec4 left = check(vec2(-1.0, 0.0));
          vec4 right = check(vec2(1.0, 0.0));
          vec4 top = check(vec2(0.0, -1.0));
          vec4 bottom = check(vec2(0.0, 1.0));

          op.xy += left.xy;
          op.xy += right.xy;
          op.xy += top.xy;
          op.xy += bottom.xy;
          
          op.z = center.z;

        }else{

          //ベクトルが存在している＝実機が存在
          op.x = 0.0;//ベクトルをゼロにする
          op.y = 0.0;
          op.z = 1.0-step(0.5,center.z);//床の色を反転
        
        }

        op.x+=1.0;
        op.y+=1.0;
        op.x/=2.0;
        op.y/=2.0;

        gl_FragColor = op;
         
      }