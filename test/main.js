!function() {

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
                    ctx.clearRect(0,0,source.width,source.height)
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
                        sketching.discolor(imgData.data);
                        ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'invert':
                        sketching.invert(imgData.data);
                        ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'gaussBlur':
                        sketching.gaussBlur(imgData.data, imgData.width, imgData.height);
                        ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'dodgeColor':
                        // dodgeColor(imgData.data, imgData2.data);
                        // ctx2.putImageData(imgData, 0, 0);
                        break;
                    case 'sketch':
                    
                        imgData2 = ctx.getImageData(0, 0, source.width, source.height);
                        // discolor(imgData.data);
                        sketching.discolor(imgData2.data);
                        t = +new Date;
                        data = Array.prototype.slice.call(imgData2.data, 0);
                        console.log(+new Date - t);
                        sketching.invert(data);
 
                        sketching.gaussBlur(data, imgData2.width, imgData2.height, 5);
                        
                        sketching.dodgeColor(imgData2.data, data);

                        ctx2.putImageData(imgData2, 0, 0);
                        // imgData2 = ctx.getImageData(0, 0, source.width, source.height);
                        // // discolor(imgData.data);
                        // sketching.discolor(imgData2.data);
                        // t = +new Date;
                        // ctx2.putImageData(imgData2, 0, 0);
                        // imgData = ctx2.getImageData(0, 0, source.width, source.height);
                        // console.log(+new Date - t);
                        // sketching.invert(imgData2.data);
 
                        // sketching.gaussBlur(imgData2.data, imgData2.width, imgData2.height, 5);
                        
                        // sketching.dodgeColor(imgData.data, imgData2.data);

                        // ctx2.putImageData(imgData, 0, 0);

                        break;
                    default:
                        break;
                }
            }
        });
    }

    testCase();


}();
