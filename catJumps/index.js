const character = document.getElementById("character");
const obstacle = document.getElementById("obstacle");

function jump() {
  if (character.classList != "jump") {
    character.classList.add("jump");
    setTimeout(() => {
      character.classList.remove("jump");
    }, 300);
  }
}

let score = document.getElementById("number").textContent;

let alive = setInterval(() => {
  //checkY
  let charTop = parseInt(
    window.getComputedStyle(character).getPropertyValue("top")
  );

  //checkX
  let obstacleLeft = parseInt(
    window.getComputedStyle(obstacle).getPropertyValue("left")
  );

  //collision

  if (obstacleLeft < 80 && charTop >= 230) {
    alert("Game over. Jump harder.");
  }
}, 10);

//totally cheating... but no one will ever know.
let scoreInterval = setInterval(() => {
  score++;
  for (let i = 0; i < score; i++) {
    document.getElementById("number").innerHTML = score;
  }
}, 1000);

document.addEventListener("click", (event) => {
  jump();
});
