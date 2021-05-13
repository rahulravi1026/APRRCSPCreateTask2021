let cardFlippedSameTurn = false;
let boardNotClickable = false;
let firstCardFlipped;
let secondCardFlipped;
let matched = 0;
let flipped = 0;
let time = 23;
let difficultyLevel = 0;
let secondChance1600 = true;

const playingCards = document.querySelectorAll('.playing-card');

document.getElementById("time").innerHTML = "Time: " + time.toString()

function startTimer() {
  alert("You can only get one match wrong, so there is some luck involved! You have 23 seconds!")
  setInterval(function() { 
  time = time - 1;
  if (time == -1) {
    var answer = confirm("Time's up! Want to go back to the original game?")
    if (answer){
      alert("Good luck! Try getting a 1600 on the first time itself!")
      location.replace("index.html");
    }
    else {
      alert("Thanks for playing! See you later!")
      location.close()
    }
  }
  document.getElementById("time").innerHTML = "Time: " + (time).toString();}, 1000);
}

function flipCard() {
  if (boardNotClickable) 
    return;
  if (this === firstCardFlipped) 
    return;

  this.classList.add('flip');

  if (!cardFlippedSameTurn) {
    // first click
    cardFlippedSameTurn = true;
    firstCardFlipped = this;

    return;
  }

  // second click
  secondCardFlipped = this;

  checkIfCardsMatch();
}

function checkIfCardsMatch() {
  flipped++;

  let cardsMatch = firstCardFlipped.dataset.framework === secondCardFlipped.dataset.framework;
  cardsMatch ? deactivateCards() : returnCardsOriginal();

  if (cardsMatch) {
    matched++;
    flipped--;
  }

  if (flipped > 2 && !cardsMatch) {
    secondChance1600 = false;
    var answer = confirm("You've failed to get the 1600 on the second attempt since you got more than 1 match wrong! Want to go back to the original game?")
    if (answer){
      alert("Good luck! Try getting a 1600 on the first time itself!")
      location.replace("index.html");
    }
    else {
      alert("Thanks for playing! See you later!")
      location.close()
    }
    return;
  }

  if (matched == 4) {
    var answer = confirm("Your score is upgraded to a 1600! Want to play again?")
    if (answer) {
      alert("Good luck! Try getting a 1600 the first time itself!")
      location.replace("index.html")
    }
    else {
      alert("Thanks for playing! See you later!")
      location.close()
    }

  }
}

function deactivateCards() {
  firstCardFlipped.removeEventListener('click', flipCard);
  secondCardFlipped.removeEventListener('click', flipCard);

  resetForNextTurn();
}

function returnCardsOriginal() {
  boardNotClickable = true;

  setTimeout(() => {
    firstCardFlipped.classList.remove('flip');
    secondCardFlipped.classList.remove('flip');

    resetForNextTurn();
  }, 1500);
}

function resetForNextTurn() {
  [cardFlippedSameTurn, boardNotClickable] = [false, false];
  [firstCardFlipped, secondCardFlipped] = [null, null];
}

(function shuffleAllCards() {
  playingCards.forEach(playingCard => {
    let randomPosition = Math.floor(Math.random() * 8);
    playingCard.style.order = randomPosition;
  });
})();

playingCards.forEach(playingCard => playingCard.addEventListener('click', flipCard));
