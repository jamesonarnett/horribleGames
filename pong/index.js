const canvas = document.getElementById("pong");

const context = canvas.getContext("2d");

function drawRect(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = "60px sans";
  context.fillText(text, x, y);
}

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

const player = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};

const computer = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "white",
  score: 0,
};

const net = {
  x: canvas.width / 2 - 2 / 2,
  y: 0,
  width: 2,
  height: 10,
  color: "white",
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  color: "white",
};

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "black");

  drawText(player.score, canvas.width / 4, canvas.height / 5, "white");
  drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "white");
  drawNet();
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(
    computer.x,
    computer.y,
    computer.width,
    computer.height,
    computer.color
  );
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function update() {
  ball.x += velocityX;
  ball.y += velocityY;
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    velocityY = -velocityY;
  }
}

function game() {
  render();
  update();
}

const framesPerSecond = 50;
setInterval(game, 1000 / framesPerSecond);
