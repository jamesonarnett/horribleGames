const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
const restartBtn = document.getElementById("restart");

let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
let platformCount = 5;
let isGameOver = false;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;

const createDoodler = () => {
  grid.appendChild(doodler);
  doodler.classList.add("doodler");
  doodlerLeftSpace = platforms[0].left;
  doodler.style.left = doodlerLeftSpace + "px";
  doodler.style.bottom = doodlerBottomSpace + "px";
};

class Platform {
  constructor(newPlatBottom) {
    this.left = Math.random() * 315;
    this.bottom = newPlatBottom;
    this.visual = document.createElement("div");

    const visual = this.visual;
    visual.classList.add("platform");
    visual.style.left = this.left + "px";
    visual.style.bottom = this.bottom + "px";
    grid.appendChild(visual);
  }
}

function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platGap = 600 / platformCount;
    let newPlatBottom = 100 + i * platGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
    console.log(platforms);
  }
}

function movePlatforms() {
  if (doodlerBottomSpace > 200) {
    platforms.forEach((platform) => {
      platform.bottom -= 4;

      let visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";

      if (platform.bottom < 10) {
        let firstPlatform = platforms[0].visual;

        firstPlatform.classList.remove("platform");
        platforms.shift();
        score++;
        console.log(score);

        let newPlatform = new Platform(600);
        platforms.push(newPlatform);
      }
    });
  }
}

function jump() {
  clearInterval(downTimerId);
  isJumping = true;
  upTimerId = setInterval(() => {
    doodlerBottomSpace += 20;
    doodler.style.bottom = doodlerBottomSpace + "px";
    if (doodlerBottomSpace > startPoint + 200) {
      fall();
      isJumping = false;
    }
  }, 30);
}

function fall() {
  clearInterval(upTimerId);
  isJumping = false;
  downTimerId = setInterval(() => {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + "px";

    if (doodlerBottomSpace <= 0) {
      gameOver();
    }

    platforms.forEach((platform) => {
      if (
        doodlerBottomSpace >= platform.bottom &&
        doodlerBottomSpace <= platform.bottom + 15 &&
        doodlerLeftSpace + 60 >= platform.left &&
        doodlerLeftSpace <= platform.left + 85 &&
        !isJumping
      ) {
        console.log("landing");
        startPoint = doodlerBottomSpace;
        jump();
      }
    });
  }, 20);
}

function gameOver() {
  console.log("game over");
  isGameOver = true;

  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  grid.innerHTML = `Score: ${score}`;

  clearInterval(upTimerId);
  clearInterval(downTimerId);
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}

function control(e) {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowUp") {
    moveStraight();
  }
}

function moveLeft() {
  if (isGoingRight) {
    clearInterval(rightTimerId);
    isGoingRight = false;
  }

  isGoingLeft = true;
  leftTimerId = setInterval(() => {
    if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + "px";
    } else {
      moveRight();
    }
  }, 30);
}

function moveRight() {
  if (isGoingLeft) {
    clearInterval(leftTimerId);
    isGoingLeft = false;
  }

  isGoingRight = true;
  rightTimerId = setInterval(() => {
    if (doodlerLeftSpace <= 340) {
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + "px";
    } else {
      moveLeft();
    }
  }, 30);
}

function moveStraight() {
  isGoingLeft = false;
  isGoingRight = false;

  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
}

// function restart() {
//   isGameOver = false;
//   doodlerLeftSpace = 50;
//   startPoint = 150;
//   doodlerBottomSpace = startPoint;
//   platformCount = 5;
//   isGameOver = false;
//   platforms = [];
//   upTimerId;
//   downTimerId;
//   isJumping = true;
//   isGoingLeft = false;
//   isGoingRight = false;
//   leftTimerId;
//   rightTimerId;
//   score = 0;
// }

const start = () => {
  if (!isGameOver) {
    createPlatforms();
    createDoodler();

    setInterval(movePlatforms, 30);
    jump();
    document.addEventListener("keydown", control);
  }
};

start();

// restartBtn.addEventListener("click", function (event) {
//   restart();
//   start();
// });
