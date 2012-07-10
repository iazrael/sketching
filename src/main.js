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
     * @param  {Number} radius 取样区域半径, 正数, 可选, 默认为 3.0
     * @param  {Number} sigma 标准方差, 可选, 默认取值为 radius / 3
     * @return {Array}
     */
    function gaussBlur(pixes, width, height, radius, sigma) {
        var gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k, len;

        radius = Math.floor(radius) || 3;
        sigma = sigma || radius / 3;
        
        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
        //生成高斯矩阵
        for (i = 0, x = -radius; x <= radius; x++, i++){
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;
        
        }
        //归一化, 保证高斯矩阵的值在[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                for(j = -radius; j <= radius; j++){
                    k = x + j;
                    if(k >= 0 && k < width){//确保 k 没超出 x 的范围
                        //r,g,b,a 四个一组
                        i = (y * width + k) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r;
                pixes[i + 1] = g;
                pixes[i + 2] = b;
                // pixes[i + 3] = a ;
            }
        }
        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0;
                for(j = -radius; j <= radius; j++){
                    k = y + j;
                    if(k >= 0 && k < height){//确保 k 没超出 y 的范围
                        i = (k * width + x) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r;
                pixes[i + 1] = g;
                pixes[i + 2] = b;
                // pixes[i + 3] = a ;
            }
        }
        //end
        return pixes;
    }

    /************************* testCase ***************************/
    function $(id){
        return document.getElementById(id);
    }
    testDiscolor = function(){
        var width = 2, height = 2,
            pixes = [];
        for(var i = 0, len = width * height * 4; i < len; i++){
            pixes[i] = Math.round(255 * Math.random());
        }
        console.log(JSON.stringify(pixes));
        discolor(pixes);
        console.log(pixes);
    }

    testCaseGaussBlur = function(){
        var width = 5, height = 5,
            pixes = [];
        for(var i = 0, len = width * height * 4; i < len; i++){
            pixes[i] = Math.round(255 * Math.random());
        }
        console.log(JSON.stringify(pixes));
        gaussBlur(pixes, width, height);
        console.log(pixes);
    }

    testCase = function (){
        var source = $('source');
        var ctx = source.getContext('2d');
        var target = $('target');
        var ctx2 = target.getContext('2d');
        var tools = $('tools');

        ctx.font= '30px sans-serif';
        ctx.fillText('Drop a picture to here', 80, 100);

        ctx2.font= '30px sans-serif';
        ctx2.fillText('You will see the result in here', 20, 100);

        source.addEventListener('drop', function(e){
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            var reader = new FileReader();
            reader.onload = function(e){
                var img = new Image();
                img.onload = function(){
                    ctx.drawImage(img, 0 ,0);
                }
                img.src = e.target.result;
            }
            reader.onerror = function(e){
                alert(e.target.error.code);
            }
            reader.readAsDataURL(file);
        });
        tools.addEventListener('click', function(e){
            if(e.target.tagName === 'INPUT'){
                var value = e.target.value;
                var imgData = ctx.getImageData(0, 0, source.width, source.height);
                switch(value){
                    case 'discolor':
                        discolor(imgData.data);
                        ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'invert':
                        invert(imgData.data);
                        ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'gaussBlur':
                        gaussBlur(imgData.data, imgData.width, imgData.height);
                        ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'dodgeColor':
                        // dodgeColor(imgData.data, imgData2.data);
                        // ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'sketch':
                        imgData2 = ctx.getImageData(0, 0, source.width, source.height);
                        discolor(imgData.data);
                        discolor(imgData2.data);
                       
                        invert(imgData2.data);
                        
                        gaussBlur(imgData2.data, imgData2.width, imgData2.height, 5, 1);
                        
                        dodgeColor(imgData.data, imgData2.data);
                        ctx2.putImageData(imgData, 0, 0);


                        break;
                    default:
                        break;
                }
            }
        });
    }

    testCase();


})();
