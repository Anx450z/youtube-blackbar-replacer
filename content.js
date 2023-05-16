let youtubePlayer = document.getElementsByClassName("html5-video-player")[0];
const videoStream = document.getElementsByClassName("video-stream html5-main-video")[0];

function outBrightnessRange(r,g,b){
  const brightness = (r + g + b) / 3; // calculate brightness
    if (brightness < 20 || brightness > 90) { // skip colors
      return true;
    }
    return false;
}

function getMostFrequentColor(data) {
  let colorCount = {};
  let maxCount = 0;
  let maxColor = null;
  for (let i = 0; i < data.length; i += 8) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    if (outBrightnessRange(r,g,b)){
      continue
    }
    let color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
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
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 8) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    if (outBrightnessRange(r,g,b)){
      continue
    }
  }
  let numPixels = data.length / 8;
  let avgR = Math.round(r / numPixels);
  let avgG = Math.round(g / numPixels);
  let avgB = Math.round(b / numPixels);
  let avgColor = 'rgb(' + avgR + ', ' + avgG + ', ' + avgB + ')';
  return avgColor
}


setInterval(function() {
  if (youtubePlayer == null) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = videoStream.videoWidth;
  canvas.height = videoStream.videoHeight;
  ctx.drawImage(videoStream, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const avgColor = getAverageColor(data);
  // const mostFrequentColor = getMostFrequentColor(data);

  youtubePlayer.style.backgroundColor = avgColor;
  youtubePlayer.style.transition = 'background-color 2s ease';
}, 2500);
