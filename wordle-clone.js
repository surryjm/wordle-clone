let currentLength = 0;
let maxLength = 5;
let nextBox;
const boxes = document.querySelectorAll(".letter-box");

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
  console.log("enter");
  if (currentLength < 5) {
    return;
  } else if (currentLength === 5) {
    submitWord();
  }
}

function handleBackspace() {
  console.log("backspace");
  if (currentLength === 0) {
    return;
  } else {
    
  }
}

function submitWord() {
  console.log("submitWord");
  currentLength = 0;
}

function getNextBox(boxes) {
  const boxesArr = [...boxes];
  nextBox = boxesArr.find(box => box.innerText === "");
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
    nextBox.innerText = letter;
    currentLength += 1;
  }
}

function init() {
  document.addEventListener("keydown", function (event) {
    if (!isLetter(event.key)) {
      event.preventDefault();
    } else {
      isLetter(event.key);
    }
  })
}

init();