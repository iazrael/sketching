(function() {

    /**
     * 把图像编程黑白色
     * Y = 0.299R + 0.587G + 0.114B
     * @param  {Array} pixes pix array
     * @return {Array}
     * @link {http://www.61ic.com/Article/DaVinci/DM64X/200804/19645.html}
     */

    function discolor(pixes) {
        var grayscale;
        for (var i = 0, len = pixes.length; i < len; i += 4) {
            grayscale = pixes[i] * 0.299 + pixes[i + 1] * 0.587 + pixes[i + 2] * 0.114;
            pixes[i] = pixes[i + 1] = pixes[i + 2] = grayscale;
        }
        return pixes;
    }

    /**
     * 把图片反相, 即将某个颜色换成它的补色
     * @param  {Array} pixes pix array
     * @return {Array}
     */

    function invert(pixes) {
        for (var i = 0, len = pixes.length; i < len; i += 4) {
            pixes[i] = 255 - pixes[i]; //r
            pixes[i + 1] = 255 - pixes[i + 1]; //g
            pixes[i + 2] = 255 - pixes[i + 2]; //b
        }
        return pixes;
    }
    /**
     * 颜色减淡,
     * 结果色 = 基色 + (混合色 * 基色) / (255 - 混合色)
     * @param  {Array} basePixes 基色
     * @param  {Array} mixPixes  混合色
     * @return {Array}
     */

    function dodgeColor(basePixes, mixPixes) {
        for (var i = 0, len = basePixes.length; i < len; i += 4) {
            basePixes[i] = basePixes[i] + (basePixes[i] * mixPixes[i]) / (255 - mixPixes[i]);
            basePixes[i + 1] = basePixes[i + 1] + (basePixes[i + 1] * mixPixes[i + 1]) / (255 - mixPixes[i + 1]);
            basePixes[i + 2] = basePixes[i + 2] + (basePixes[i + 2] * mixPixes[i + 2]) / (255 - mixPixes[i + 2]);

        }
        return basePixes;
    }

    /**
     * 高斯模糊
     * @param  {Array} pixes  pix array
     * @param  {Number} width 图片的宽度
     * @param  {Number} height 图片的高度
     * @param  {Number} radius 取样区域半径, 可选, 默认为 3.0
     * @return {Array}
     */

    function gaussBlur(pixes, width, height, radius) {
        var gaussMatrix = [],
            gaussSum = 0,
            diamet,
            sigma,
            sigma2,
            x, y, m, n,
            xx, yy,
            r, g, b, a,
            i, j, len;

        radius = radius || 3;
        diamet = radius * 2 + 1;// 采样区域直径
        sigma = radius / 3;
        sigma2 = 2 * sigma * sigma;

        //生成高斯矩阵
        for (i = 0, y = -radius; y <= radius; y++) {
            for(x = -radius; x <= radius; x++, i++){
                a = Math.exp(-(x * x + y * y) / sigma2);
                gaussMatrix[i] = a;
                gaussSum += a;
            }
        }
        // console.log(JSON.stringify(gaussMatrix));
        //归一化, 保证高斯矩阵的值在[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        // console.log(JSON.stringify(gaussMatrix));
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                j = 0;
                // j = (y * width + x) * 4;
                for(m = -radius; m <= radius; m++){
                    yy = y + m;
                    if(yy >= 0 && yy < height){
                        for(n = -radius; n <= radius; n++){
                            xx = x + n;
                            if(x >= 0 && x < width){
                                i = (height - yy - 1) * width + xx;
                                r += pixes[i] * gaussMatrix[j];
                                g += pixes[i + 1] * gaussMatrix[j];
                                b += pixes[i + 2] * gaussMatrix[j];
                            }
                            j++;
                        }
                    }else{
                        j += diamet;
                    }
                }
                i = (height - y - 1) * width + x;
                pixes[i] = r;
                pixes[i + 1] = g;
                pixes[i + 2] = b;
                // pixes[i + 3] = a / gaussSum;
                
            }
        }
        //end
        return pixes;
    }

    function testCase(){
        var width = 5, height = 5,
            pixes = [];
        for(var i = 0, len = width * height * 4; i < len; i++){
            pixes[i] = Math.round(255 * Math.random());
        }
        console.log(JSON.stringify(pixes));
        gaussBlur(pixes, width, height);
        console.log(pixes);
    }

    testCase();

})();
