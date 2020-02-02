var counter = 0;
function run() {
    // var file = document.getElementById("thefile");
    // var audio = document.getElementById("audio");

    file.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);

        audio.load();
        audio.play();
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        //analyser.fftSize = 256;

        analyser.fftSize = 512;

        var bufferLength = analyser.frequencyBinCount;

        var dataArray = new Uint8Array(bufferLength);
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barHeight;
        var x = 0;

        function toRadians(angle){
            return angle * (Math.PI / 180);
        }

        function changeColor() {
            RGBColor1 = Math.floor(Math.random() * Math.floor(255));
            RGBColor2 = Math.floor(Math.random() * Math.floor(255));
            RGBColor3 = Math.floor(Math.random() * Math.floor(255));
        }


        function renderFrame() {
            requestAnimationFrame(renderFrame);



            ctx.beginPath();

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            // ctx.shadowBlur = "900";
            // ctx.globalAlpha = 0.2;
            ctx.fillRect(0, 0, WIDTH, HEIGHT);


            for (var i = 0; i < bufferLength; i++) {



                var degreesPerDivision = 360 / (bufferLength);
                var radiansPerDivision = toRadians(degreesPerDivision);

                var yoffset = Math.pow((Math.sin((radiansPerDivision * (i))) * dataArray[i] + 0.2),1.2);
                var xoffset = 1.5 * (yoffset / (Math.tan(radiansPerDivision * (i))));

                ctx.moveTo(WIDTH / 2, HEIGHT / 2);

                ctx.lineTo(WIDTH /2 + xoffset, HEIGHT / 2 - yoffset +5);
                ctx.moveTo(WIDTH /2 , HEIGHT /2);
                ctx.lineTo(WIDTH /2 + xoffset, HEIGHT / 2 + yoffset -5);

                barHeight = dataArray[i];

                var r = barHeight + (5 * (i/bufferLength));
                var g = 100 * (i/bufferLength);
                var b = 0;

                // ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";

                ctx.strokeStyle = color;
                counter += 1;

                ctx.stroke();

            }
            ctx.closePath();
        }
        document.querySelector("#canvas").style.opacity = "0.3";
        window.addEventListener('resize', onWindowResize, false);
        audio.loop = true;
        audio.play();
        renderFrame();
    };
};