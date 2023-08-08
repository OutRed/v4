// Rat model - https://sketchfab.com/EWTube0 CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
const MAX_VOLUME = 0.6;

let rat;
let ratUV;

let isSpinning = false
let dailyMaxViewerCount = 1

let viewTime = localStorage.getItem('viewTime')
viewTime == null ? viewTime == 0 : viewTime = Number(viewTime)

let isTouchDevice = 'ontouchstart' in window;

let muted = false;

function preload() {
  rat = loadModel('assets/rat/rat.obj',true);
  ratUV = loadImage('assets/rat/rat.jpg');
  ratTunes = loadSound(['assets/tunes/tunes.ogg', 'assets/tunes/tunes.mp3']);
}

function setup() {
  createCanvas(300, 300, WEBGL);
  describe('Horizontally spinning rat');
  frameRate(60);
  pixelDensity(1.0);

  document.getElementById('twotwelve-link').addEventListener('mousedown', (event) => {
    // Prevent the link counting as a mousedown, interrupting the tunes :(
    event.stopPropagation();
  });


  document.getElementById('sound-indicator').addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
  document.getElementById('sound-indicator').addEventListener('pointerup', toggleVolume);
  document.getElementById('sound-indicator').addEventListener('keydown', (event) => {
    if (event.code === "Space") {
      // Prevent page scroll attempt
      event.preventDefault();
    }
    // If enter is pressed, activate the button
    else if (event.code === "Enter") {
      event.preventDefault();
      toggleVolume();
    }
  });
  document.getElementById('sound-indicator').addEventListener('keyup', (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      toggleVolume();
    }
  })

  document.getElementById('start-instruction').addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
  document.getElementById('start-instruction').addEventListener('pointerup', processPress);
  document.getElementById('start-instruction').addEventListener('keydown', (event) => {
    if (event.code === "Space") {
      // Prevent page scroll attempt
      event.preventDefault();
    }
    // If enter is pressed, activate the button
    else if (event.code === "Enter") {
      event.preventDefault();
      processPress();
    }
  });
  document.getElementById('start-instruction').addEventListener('keyup', (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      processPress();
    }
  })
}

function draw() {
  if (!isSpinning) { return }

  let ratCount = Math.floor(dailyMaxViewerCount / 100) + 1
  let ratRotation = -(Date.now()/20 % 360) * (dailyMaxViewerCount < 300 ? Math.floor((dailyMaxViewerCount%100/10) + 1) : 2)

  angleMode(DEGREES);
  noStroke();
  background(0);

  scale(1.0 - (0.5 * (Math.min(10,ratCount)/10)) - (0.20 * (Math.floor(ratCount/10)/10))) // SQUISH THE RAT
  rotateZ(180); // FLIP THE RAT
  rotateY(ratRotation); // SPIN THE RAT
  texture(ratUV); // TEXTURE THE RAT

  for (let i = 0; i < ratCount; i++) {
    push();
    // MOVE OVER, RAT!
    translate(
      (40 * (i%10)) + 20 + (
        Math.floor(ratCount/10)*10 <= i && ratCount > 10 
        ? -20 * (ratCount%(Math.floor(ratCount/10)*10))
        : -20 * Math.min(ratCount, 10) 
      ),
      (-18 * Math.floor(ratCount/10)) + 5 + (40 * Math.floor(i/10)),
      -35
    );
    // SUMMON THE RAT
    model(rat);
    pop();
  }

}

function processPress() {
  if (!isSpinning) {
    isSpinning = true
    document.getElementById("start-instruction").style.display = 'none'
    document.getElementById("view-counter").innerHTML = 'Look at that rat go!'
    updateLiveViewers()
    startViewTimeCounter()
  }

  if (!ratTunes.isPlaying()) {
    ratTunes.loop();
    ratTunes.setVolume(0);
    if (!muted) {
      ratTunes.setVolume(MAX_VOLUME, 10);
    }
  }
}

function toggleVolume() {
  muted = !muted;

  if (muted) {
    ratTunes.setVolume(0);
    document.getElementById("sound-indicator").innerHTML = 'tunes: <span class="status">off</span>';
    document.getElementById("sound-indicator").classList = ['off'];
  } else {
    ratTunes.setVolume(MAX_VOLUME);
    document.getElementById("sound-indicator").innerHTML = 'tunes: <span class="status">on</span>';
    document.getElementById("sound-indicator").classList = ['on'];
  }
}

function mousePressed() {
  if (isTouchDevice) return
  processPress()
}

function mouseClicked() {
  if (!isTouchDevice) return
  processPress()
}

const updateLiveViewers = ()=>{
  if (!isSpinning) { return }
  fetch('ping.json').then(
    response => response.json()
  ).then(json => {
    let viewerCount = json.live_pings ? json.live_pings : 1
    document.getElementById("view-counter").innerHTML = `
      ${viewerCount} ${viewerCount > 1 ? 'people are' : 'person is'}
      watching the
      ${dailyMaxViewerCount >= 100 ? 'rats' : 'rat'}
      right now.
      <br/>
    `
    dailyMaxViewerCount = json.max_pings ? json.max_pings : 1
    document.getElementById("highscore").innerHTML = `
      Daily highscore: ${json.max_pings} | Higher score = faster rat
    `
  }).catch(
    err => {
      console.log(err)
    }
  )
}
setInterval(updateLiveViewers, 5000)

lastViewTimeUpdate = Date.now()
const updateViewTime = ()=> {
  now = Date.now()
  viewTime += now - lastViewTimeUpdate
  lastViewTimeUpdate = now
  localStorage.setItem('viewTime', viewTime)
  document.getElementById('view-time').innerHTML = `
    Rat time: ${
      humanizeDuration(
        viewTime,
        {
          round: true
        }
      )}
  `
}
const startViewTimeCounter = ()=> {
  lastViewTimeUpdate = Date.now()
  setInterval(updateViewTime, 1000)

}
