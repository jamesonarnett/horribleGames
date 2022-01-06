// rob stackOverFlow for shuffle arr
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

class Jeopardy {
  constructor(elem, options = {}) {
    //catergoreies pulled from jservice.io/search
    this.useCategoreyIds = options.useCategoreyIds || [
      1892,
      Math.floor(Math.random() * 5000) + 1,
      4483,
      Math.floor(Math.random() * 5000) + 1,
      88,
      Math.floor(Math.random() * 5000) + 1,
    ];

    //"database"
    this.categories = [];
    this.clues = {};

    //state
    this.currentClue = null;
    this.score = 0;

    //elem reference
    this.boardElement = elem.querySelector(".board");
    this.scoreCountElement = elem.querySelector(".scoreCount");
    this.formElement = elem.querySelector("form");
    this.inputElement = elem.querySelector("input[name=user-answer]");
    this.modalElement = elem.querySelector(".cardModal");
    this.clueTextElement = elem.querySelector(".clueText");
    this.resultElement = elem.querySelector(".result");
    this.resultTextElement = elem.querySelector(".resultCorrectAnswerText");
    this.successTextElement = elem.querySelector(".resultSuccess");
    this.failTextElement = elem.querySelector(".resultFail");
  }

  initGame() {
    this.updateScore(0);
    this.fetchCats();

    this.boardElement.addEventListener("click", (event) => {
      if (event.target.dataset.clueId) {
        this.handleClueClick(event);
      }
    });

    this.formElement.addEventListener("submit", (event) => {
      this.handleFormSubmit(event);
    });
  }

  updateScore(change) {
    this.score += change;
    this.scoreCountElement.textContent = this.score;
  }

  fetchCats() {
    const categories = this.useCategoreyIds.map((categoryId) => {
      return new Promise((resolve, reject) => {
        fetch(`https://jservice.io/api/category?id=${categoryId}`)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          });
      });
    });

    Promise.all(categories).then((results) => {
      results.forEach((category, categoreyIndex) => {
        let newCategory = {
          title: category.title,
          clues: [],
        };

        let clues = shuffle(category.clues)
          .splice(0, 5)
          .forEach((clue, index) => {
            let clueId = categoreyIndex + "-" + index;
            newCategory.clues.push(clueId);

            this.clues[clueId] = {
              question: clue.question,
              answer: clue.answer,
              value: (index + 1) * 100,
            };
          });

        this.categories.push(newCategory);
      });
      this.categories.forEach((c) => {
        this.renderCategory(c);
      });
    });
  }
  renderCategory(category) {
    let column = document.createElement("div");
    column.classList.add("column");

    column.innerHTML = `<header>${category.title}</header>
        <ul>
        </ul>`.trim();

    let ul = column.querySelector("ul");
    category.clues.forEach((clueId) => {
      let clue = this.clues[clueId];
      ul.innerHTML += `<li><button data-clue-id=${clueId}>${clue.value}</button></li>`;
    });

    this.boardElement.appendChild(column);
  }

  handleClueClick(event) {
    let clue = this.clues[event.target.dataset.clueId];

    event.target.classList.add("used");

    this.inputElement.value = "";

    this.currentClue = clue;

    this.clueTextElement.textContent = this.currentClue.question;
    this.resultTextElement.textContent = this.currentClue.answer;

    this.modalElement.classList.remove("showingResult");

    this.modalElement.classList.add("visible");
    this.inputElement.focus();
  }

  cleanAnswer(input) {
    let modAnswer = input.toLowerCase();
    modAnswer = modAnswer.replace("<i>", "");
    modAnswer = modAnswer.replace("</i>", "");
    modAnswer = modAnswer.replace(/ /g, "");
    modAnswer = modAnswer.replace(/"/g, "");
    modAnswer = modAnswer.replace(/^an/, "");
    return modAnswer.trim();
  }

  handleFormSubmit(event) {
    event.preventDefault();

    let correct = this.inputElement.value.toLowerCase().trim();
    console.log(correct);
    let check = this.cleanAnswer(this.currentClue.answer);
    console.log(check);

    let isCorrect = correct === check;
    if (isCorrect) {
      this.updateScore(this.currentClue.value);
    }
    this.revealAnswer(isCorrect);
  }

  revealAnswer(isCorrect) {
    this.successTextElement.style.display = isCorrect ? "block" : "none";
    this.failTextElement.style.display = !isCorrect ? "block" : "none";

    this.modalElement.classList.add("showingResult");

    setTimeout(() => {
      this.modalElement.classList.remove("visible");
    }, 2000);
  }
}

const game = new Jeopardy(document.querySelector(".app"), {});
game.initGame();
