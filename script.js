let canvas = document.querySelector('canvas');
let body = document.querySelector('body');
let audio = document.querySelector('.audio');
let jumpClick = document.querySelector('.jump');
let pauseClick = document.querySelector('.playPause');

// variables
let process;
let canvasCoords = canvas.getBoundingClientRect();
let jump = false;
let frames = 0;
// i для функции анимации дино
let i = 0;
// delta x (speed)
let dx = 3;
// for fail
let cancel = false;
audio.volume = 0.05;
let ctx = canvas.getContext('2d');
let score = -1;
let timetwo = 0;

// size canvas
canvas.width = window.innerWidth-10;
canvas.height = 150;

// load and check load image dino
let dino = new Image();
dino.src = 'dino.png';
// load and check load image cactus
let cactus = new Image();
cactus.src = 'cactus.png';
let cactus2 = new Image();
cactus2.src = 'cactus2.png';
let stone = new Image();
stone.src = 'stone.png';
// line ground
let line = new Image();
line.src = 'line.png';
// line2 ground
let line2 = new Image();
line2.src = 'line2.png';

// dino metrics
let d = {
  x: 50,
  y: 80,
  dy: 3,
}
// line metrics
let l = {
  x: 0,
  y: 102,
}
// line2 metrics
let l2 = {
  x: 1024,
  y: 102,
}
// cactus coords snd images
let ac = [[canvas.width, cactus]];

// animation dino
function dinoAnimation (x) {
  if (x) {
    dino.src = 'jump.png';
    return 
  }
  let slides = ["dino.png", "dino2.png"];
  dino.src = slides[i];
  i += 1;
  if (i === slides.length) {
    i = 0;
  }
}
// random cactus
function randomCactus(index) {
  let randomNum = Math.random() * 110 + 120;
  let cactuses = [cactus, cactus2, stone];
  let cactusImg = cactuses[Math.floor(Math.random() * cactuses.length)];
  ac.push([ac[index][0] + randomNum, cactusImg]);
}

setTimeout(() => {
   window.cancelAnimationFrame(process);
}, 100)

// process
function draw() {
  let time = new Date();
  
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // score
  ctx.beginPath();
  ctx.font = '25px Impact';
  ctx.fillStyle = '#46FFC6';
  ctx.fillText(score, canvas.width - 70, 30)
  // lines
  ctx.drawImage(line, l.x, l.y);
  ctx.drawImage(line2, l2.x, l2.y);
  // move line
  l.x -= dx;
  l2.x -= dx;
  if (l.x + line.width <= 0) {
    l.x = line2.width - 8;
  }
  if (l2.x + line2.width <= 0) {
    l2.x = line.width - 8;
  }
  // draw images
  // dino
  ctx.drawImage(dino, d.x, d.y);
  if (frames === 8) {
    dinoAnimation();
    frames = 0;
  }
  // move cactus
  ac.forEach((x, index) => {
    ac[index][0] -= dx;
    ctx.drawImage(ac[index][1], x[0], 113 - ac[index][1].height);
    
    if (ac[index][0] >= canvas.width * 0.7 && ac[index][0] < canvas.width * 0.7 + dx) {
      randomCactus(index);
    }
    if (ac[index][0] < -canvas.width) {
      ac.shift();
    }
  })
  // jump dino
  if (jump) {
    dinoAnimation(true);
    d.y -= d.dy;
  }
  // tumble
  if (d.y <= 80 && !jump || d.y <= 20) {
    d.y += d.dy+1;
    jump = false;
  }
  // check bump
  ac.forEach((x, index) => {
    if (d.x + dino.width > x[0] + 7 && d.x < x[0] + x[1].width - 4 && d.y + dino.height > l.y - x[1].height + 20) {
      cancel = true;
    }
  })
  
  if (time.getSeconds() > timetwo) {
    score += 1;
  }
  switch (score) {
    case 20:
      dx = 3.5;
      break;
    case 35:
      dx = 4;
      break;
    case 50:
      dx = 4.5;
      break;
    case 65:
      dx = 5;
      break;
    case 80:
      dx = 5.5;
      break;
    case 95:
      dx = 6;
      break;
    case 114:
      dx = 7;
      break;
    default:
      break;
  }
  
  frames += 1;
  timetwo = time.getSeconds();
  
  process = window.requestAnimationFrame(draw);
  
  if (cancel) {
    alert("Your time: " + score + "sec.")
    window.cancelAnimationFrame(process);
    location.reload();
  } 
}
draw();

jumpClick.addEventListener('pointerdown',(e) =>  {
  e.preventDefault();
  jumpClick.style.transform = 'scale(1.02, 1.02)';

  if (d.y >= 80) {
    jump = true;
    audio.play();
    audio.currentTime = 0;
  }
})
jumpClick.addEventListener('pointerup',(e) =>  {
  e.preventDefault();
  jumpClick.style.transform = 'scale(1, 1)';

  jump = false;
})

// block code pause/play
let isPaused = false;
pauseClick.addEventListener('pointerdown', () => {
  if (isPaused) {
    resumeAnimation();
  }
  if (!isPaused) {
    pauseAnimation();
  }
  
  
  
  
  isPaused = !isPaused;
})
function pauseAnimation() {
  window.cancelAnimationFrame(process);

pauseClick.style.transform = 'scale(1, 1)';
}
function resumeAnimation() {
  window.requestAnimationFrame(draw);
  pauseClick.style.transform = 'scale(1.02, 1.02)';
}
