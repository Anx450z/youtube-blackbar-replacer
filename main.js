// var videoFileInput = document.getElementById('video-file-input');
// var videoPlayer = document.getElementById('video-player');
// var video = document.querySelector('.video-stream.html5-main-player');
// var videoPlayer = document.getElementById('player');
var averageColorElement = document.getElementById('average-color');
var test = document.querySelector('.test');

var iframe = document.getElementById('youtube-player');
var innerDoc = iframe.contentWindow.document || iframe.contentWindow.document;
var videoPlayer = innerDoc.getElementById('player');

iframe.onload = function() {
  console.log("loaded",iframe.contentDocument.body);
}

setInterval(function() {
  var videoPlayer = innerDoc.getElementById('player');
  console.log("videoPlayer", videoPlayer)
},5000)



// videoFileInput.addEventListener('change', function() {
//   var file = this.files[0];
//   var videoUrl = URL.createObjectURL(file);
//   videoPlayer.src = videoUrl;
// });

function outBrightnessRange(r,g,b){
  var brightness = (r + g + b) / 3; // calculate brightness
    if (brightness < 20 || brightness > 70) { // skip colors
      return true;
    }
    return false;
}

function getMostFrequentColor(data) {
  var colorCount = {};
  var maxCount = 0;
  var maxColor = null;
  for (var i = 0; i < data.length; i += 8) {
    var r = data[i];
    var g = data[i + 1];
    var b = data[i + 2];
    if (outBrightnessRange(r,g,b)){
      continue
    }
    var color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    if (!colorCount[color]) {
      colorCount[color] = 0;
    }
    colorCount[color]++;
    if (colorCount[color] > maxCount) {
      maxCount = colorCount[color];
      maxColor = color;
    }
  }
  return maxColor;
}

function getAverageColor(data){
  var r = 0, g = 0, b = 0;
  for (var i = 0; i < data.length; i += 8) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    // if (outBrightnessRange(r,g,b)){
    //   continue
    // }
  }
  var numPixels = data.length / 8;
  var avgR = Math.round(r / numPixels);
  var avgG = Math.round(g / numPixels);
  var avgB = Math.round(b / numPixels);
  var avgColor = 'rgb(' + avgR + ', ' + avgG + ', ' + avgB + ')';
  return avgColor
}

setInterval(function() {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = videoPlayer.videoWidth;
  canvas.height = videoPlayer.videoHeight;
  ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  avgColor = getAverageColor(data);
  var mostFrequentColor = getMostFrequentColor(data);
  // averageColorElement.style.backgroundColor = avgColor;
  // averageColorElement.innerText = avgColor;
  // videoPlayer.style.background = avgColor;

  averageColorElement.style.backgroundColor = mostFrequentColor;
  averageColorElement.innerText = mostFrequentColor;
  videoPlayer.style.background = mostFrequentColor;

  videoPlayer.style.transition = 'background-color 2s ease';
  averageColorElement.style.transition = 'background-color 2s ease';
}, 2500);


