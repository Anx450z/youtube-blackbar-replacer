let youtubePlayer = document.getElementsByClassName("html5-video-player")[0];
const videoStream = document.getElementsByClassName("video-stream html5-main-video")[0];

function outBrightnessRange(r,g,b){
  const brightness = (r + g + b) / 3; // calculate brightness
    if (brightness < 20) { // skip colors in range
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
  const pixel = 4; //4 sub-pixels create a pixel
  const stepSize = 8 * pixel; //Higher value is faster but less accurate
  for (let i = 0; i < data.length; i += stepSize) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    if (outBrightnessRange(r,g,b)){
      continue
    }
  }
  let numPixels = data.length / stepSize;
  let avgR = Math.round(r / numPixels);
  let avgG = Math.round(g / numPixels);
  let avgB = Math.round(b / numPixels);
  let avgColor = 'rgb(' + avgR + ', ' + avgG + ', ' + avgB + ')';
  return avgColor
}

function getSideAverageColor(data,x,y){
  let r = 0, g = 0, b = 0;
  const pixel = 4 //4 sub-pixels create a pixel
  for (let i = 0; i < data.length; i += 4*pixel) {
    if ((i/pixel)%x > x/5 && (i/pixel)%x < 4*x/5 ){
      continue;
    }
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    if (outBrightnessRange(r,g,b)){
      continue;
    }
  }
  let numPixels = data.length / (4*pixel);
  let avgR = Math.round(r / numPixels);
  let avgG = Math.round(g / numPixels);
  let avgB = Math.round(b / numPixels);
  let avgColor = 'rgb(' + avgR + ', ' + avgG + ', ' + avgB + ')';
  return avgColor
}

function getAverageColorGradient(data, resx, resy){
  let rt = 0, gt = 0, bt = 0;
  for (let i = 0; i < data.length/2; i += 8) {
    rt += data[i];
    gt += data[i + 1];
    bt += data[i + 2];
    if (outBrightnessRange(rt,gt,bt)){
      continue
    }
  }
  let rb = 0, gb = 0, bb = 0;
  for (let i = data.length/2; i < data.length; i += 8) {
    rb += data[i];
    gb += data[i + 1];
    bb += data[i + 2];
    if (outBrightnessRange(rb,gb,bb)){
      continue
    }
  }
  let numPixels = data.length / 16;
  let avgRT = Math.round(rt / numPixels);
  let avgGT = Math.round(gt / numPixels);
  let avgBT = Math.round(bt / numPixels);
  let avgColorT = 'rgb(' + avgRT + ', ' + avgGT + ', ' + avgBT + ')';

  let avgRB = Math.round(rb / numPixels);
  let avgGB = Math.round(gb / numPixels);
  let avgBB = Math.round(bb / numPixels);
  let avgColorB = 'rgb(' + avgRB + ', ' + avgGB + ', ' + avgBB + ')';
  return [avgColorT, avgColorB]
}

const updateRate = 500; //Higher value is smoother but slower

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
  // const avgColor = getSideAverageColor(data,videoStream.videoWidth, videoStream.videoHeight);
  // const avgColor2 = getAverageColorGradient(data,videoStream.width, videoStream.height);
  // const mostFrequentColor = getMostFrequentColor(data);

  youtubePlayer.style.backgroundColor = avgColor;
  // youtubePlayer.style.background = `linear-gradient(${avgColor2[0]}, ${avgColor2[1]})`;
  
  youtubePlayer.style.transition = `background ${updateRate/1000}s ease`;
}, updateRate);
