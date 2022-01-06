let blackJackGame = {
  you: {
    scoreSpan: "#your-blackjack-result",
    div: "#your-box",
    boxSize: ".flex-blackjack-row-2 div",
    score: 0,
  },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    boxSize: ".flex-blackjack-row-2 div",
    score: 0,
  },

  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],

  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },

  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  isTurnOver: false,
  pressOnce: false,
};

const YOU = blackJackGame["you"];
const DEALER = blackJackGame["dealer"];

const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const loseSound = new Audio("sounds/aww.mp3");

let windowWidth = window.screen.width;
let windowHeight = window.screen.height;
let winner;

const blackJackHit = () => {
  if (blackJackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
};

const blackJackStand = () => {
  if (blackJackGame.pressOnce === false) {
    blackJackGame["isStand"] = true;
    let yourCardImgs = document
      .querySelector("#your-box")
      .querySelectorAll("img");

    for (let i = 0; i < yourCardImgs.length; i++) {
      let card = randomCard();
      showCard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);
    }
    blackJackGame["isTurnOver"] = true;

    winnerWinner();
    showWinner(winner);
  }
  blackJackGame.pressOnce = true;
};

const randomCard = () => {
  let random = Math.floor(Math.random() * 13);
  return blackJackGame["cards"][random];
};

const showCard = (card, activeP) => {
  if (activeP["score"] <= 21) {
    let cardImg = document.createElement("img");
    cardImg.src = `images/${card}.png`;
    cardImg.style = `width:${widthSize()}; height: ${heightSize()};`;
    document.querySelector(activeP["div"]).appendChild(cardImg);
    hitSound.play();
  }
};

const widthSize = () => {
  if (windowWidth > 1000) {
    let newWidth = window.screen.width * 0.1;
    return newWidth;
  } else {
    return window.screen.width * 0.25;
  }
};

const heightSize = () => {
  if (windowHeight > 700) {
    let newHeight = window.screen.height * 0.18;
    return newHeight;
  } else {
    return window.screen.height * 0.15;
  }
};

const updateScore = (card, activeP) => {
  if (card === "A") {
    if (activeP["score"] + blackJackGame["cardsMap"][card][1] <= 21) {
      activeP["score"] += blackJackGame["cardsMap"][card][1];
    } else {
      activeP["score"] += blackJackGame["cardsMap"][card][0];
    }
  } else {
    activeP["score"] += blackJackGame["cardsMap"][card];
  }
  console.log(activeP["score"]);
};

const showScore = (activeP) => {
  if (activeP["score"] > 21) {
    document.querySelector(activeP["scoreSpan"]).textContent = "BUST!";
    document.querySelector(activeP["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activeP["scoreSpan"]).textContent = activeP["score"];
  }
};

const winnerWinner = () => {
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      winner = "Draw";
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    winner = "Draw";
  }
  return winner;
};

const showWinner = (winner) => {
  let message, messageColor;

  if (winner === YOU) {
    message = "You win!";
    messageColor = "green";
    document.querySelector("#wins").textContent = blackJackGame["wins"] += 1;
    winSound.play();
  } else if (winner === DEALER) {
    message = "You Lost!";
    messageColor = "red";
    document.querySelector("#losses").textContent = blackJackGame[
      "losses"
    ] += 1;
    loseSound.play();
  } else if (winner === "Draw") {
    message = "You draw!";
    messageColor = "yellow";
    document.querySelector("#draws").textContent = blackJackGame["draws"] += 1;
    loseSound.play();
  } else if (winner === "None") {
    message = "Both players BUST!";
    messageColor = "orange";
    loseSound.play();
  }

  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messageColor;
};

const blackJackDeal = () => {
  if (blackJackGame["isTurnOver"] === true) {
    let yourImgs = document.querySelector("#your-box").querySelectorAll("img");
    let dealerImgs = document
      .querySelector("#dealer-box")
      .querySelectorAll("img");

    YOU["score"] = DEALER["score"] = 0;
    document.querySelector("#your-blackjack-result").textContent = 0;
    document.querySelector("#dealer-blackjack-result").textContent = 0;

    document.querySelector("#your-blackjack-result").style.color = "white";
    document.querySelector("#dealer-blackjack-result").style.color = "white";

    document.querySelector("#blackjack-result").textContent = "BlackJack";

    for (let i = 0; i < yourImgs.length; i++) {
      yourImgs[i].remove();
      dealerImgs[i].remove();
    }

    blackJackGame["isStand"] = false;
    blackJackGame.pressOnce = false;
    blackJackGame["isTurnOver"] = false;
  }
};

const blackJackRestart = () => {
  blackJackDeal();
  document.querySelector("#wins").textContent = 0;
  document.querySelector("#losses").textContent = 0;
  document.querySelector("#draws").textContent = 0;

  blackJackGame.wins = 0;
  blackJackGame.losses = 0;
  blackJackGame.draws = 0;
};

//Button Event Listeners
document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackJackHit);
document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", blackJackStand);
document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackJackDeal);
document
  .querySelector("#blackjack-reset-button")
  .addEventListener("click", blackJackRestart);
