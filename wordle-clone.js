let currentId;
let currentElement;
let idArr = [];
let currentLength = 0;
let maxLength = 5;
let nextBox;
let letterArr = [];
let wordOfTheDay;
const boxes = document.querySelectorAll(".letter-box");
const loadingIcon = document.querySelector(".loading-icon");

function isLetter(inputKey) {
  const result = /^[a-zA-Z]$/.test(inputKey);
  if (!result) {
    handleNonLetter(inputKey);
  } else {
    enterLetter(inputKey);
  }
}

function handleNonLetter(inputKey) {
  switch(inputKey) {
    case "Enter":
      handleEnter();
      break;
    case "Backspace":
      handleBackspace();
      break;
    default:
      return;
  }
}

function handleEnter() {
  if (currentLength < 5) {
    return;
  } else if (currentLength === 5) {
    submitWord();
  }
}

function handleBackspace() {
  currentId = idArr[idArr.length - 1];
  currentElement = document.getElementById(currentId);
  if (currentLength === 0 || idArr.length === 0) {
    currentLength = 0;
    return;
  } else {
    currentElement.value = "";
    idArr.pop();
    letterArr.pop();
    currentId = idArr[idArr.length - 1];
    currentLength--;
  }
}

async function submitWord() {
  let submission = letterArr.join("");
  currentLength = 0;
  let currentRow = idArr;
  idArr = [];
  letterArr = [];
  isLoading = true;
  setLoading(isLoading);
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: submission }),
  });
  let data = await res.json();
  isLoading = false;
  setLoading(isLoading);
  if (!data.validWord) {
    indicateInvalidWord(currentRow);
    return;
  } else {
    compareWords(submission, currentRow);
  }
}

function compareWords(submission, currentRow) {
  console.log(submission, wordOfTheDay)
  let wordMatch = submission.localeCompare(wordOfTheDay)
  if (wordMatch === 0) {
    showWin(currentRow)
  } else {
    letterComparison(submission, wordOfTheDay, currentRow);
  }
}

function showWin(currentRow) {
  console.log('WIN')
  for (let i = 0; i < currentRow.length; i++) {
    let id = currentRow[i];
    document.getElementById(id).classList.add("letter-match");
  }
}

function letterComparison(submission, wordOfTheDay, currentRow) {
  let greenBoxId;
  let yellowBoxId;
  let grayBoxId;
  for (let i = 0; i < submission.length; i++) {
    for (let j = 0; j < wordOfTheDay.length; j++) {
      if (submission[i] === wordOfTheDay[j]) {
        if (i != j) {
          console.log('match letter - yellow', submission[i], i, wordOfTheDay[j], j)
          yellowBoxId = currentRow[i];
          document.getElementById(yellowBoxId).classList.add("letter-close");
        } else if (i === j) {
          console.log('match index - green', submission[i], i, wordOfTheDay[j], j)
          greenBoxId = currentRow[i];
          document.getElementById(greenBoxId).classList.add("letter-match");
        }
      } else {
        grayBoxId = currentRow[i];
        document.getElementById(grayBoxId).classList.add("letter-mismatch");
      }
    }
  }
}

function getNextBox(boxes) {
  const boxesArr = [...boxes];
  nextBox = boxesArr.find(box => box.value === "");
  return nextBox;
}

function enterLetter(letter) {
  nextBox = getNextBox(boxes);
  if (nextBox === undefined) {
    console.log("no empty spaces")
    return;
  } else if (currentLength === maxLength && currentLength != 0) {
    console.log("max length reached")
    return;
  } else {
    nextBox.value = letter;
    currentLength += 1;
    letterArr.push(letter.toUpperCase());
    idArr.push(nextBox.id);
  }
}

function setLoading(isLoading) {
  loadingIcon.classList.toggle("hidden", !isLoading);
}

function indicateInvalidWord(currentRow) {
  for (let i = 0; i < currentRow.length; i++) {
    let id = currentRow[i];
    let rowElement = document.getElementById(id);
    rowElement.classList.add("invalid");
  }
  currentRow = [];
}

async function init() {
  let isLoading = true;
  setLoading(isLoading);
  const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
  let data = await res.json();
  wordOfTheDay = data.word.toUpperCase();
  isLoading = false;
  setLoading(isLoading);
  document.addEventListener("keydown", function (event) {
    if (!isLetter(event.key)) {
      event.preventDefault();
    } else {
      isLetter(event.key);
    }
  })
}

init();