(function(){
    var $ = window.$ || function(id){
        return document.getElementById(id);
    }

    var doSketch = function(strangth){
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        sk.sketch(imgData.data, canvas.width, canvas.height, strangth);
    }

    var canvas = $('canvas'),
        action = $('action'),
        strangth = $('strength'),
        dropper = $('dropper'),

        ctx = canvas.getContext('2d');

    dropper.addEventListener('drop', function(e){
        e.preventDefault();
        dropper.innerHTML = '';
        var file = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.onload = function(e){
            var img = new Image();
            img.onload = function(){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0 ,0);
            }
            img.src = e.target.result;
        }
        reader.onerror = function(e){
            var code = e.target.error.code;
            if(code === 2){
                alert('place don\'t open this page using protocol fill:///');
            }else{
                alert('error code: ' + code);
            }
        }
        reader.readAsDataURL(file);
    });

})();