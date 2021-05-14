let cardFlippedSameTurn = false;
let boardNotClickable = false;
let firstCardFlipped;
let secondCardFlipped;
let matched = 0;
let flipped = 0;
let startingScore = 1600;
let time = 0;
let difficultyLevel = 0;

const playingCards = document.querySelectorAll('.playing-card');

document.getElementById("score").innerHTML = "Score: " + startingScore.toString()
document.getElementById("time").innerHTML = "Time: " + time.toString()

function startTimer(time) {
  if (time == 81) {
    document.getElementById("easy").style.backgroundColor = "#B99FEB"
  }
  if (time == 61) {
    document.getElementById("medium").style.backgroundColor = "#B99FEB"
  }
  if (time == 41) {
    document.getElementById("hard").style.backgroundColor = "#B99FEB"
  }
  setInterval(function() { 
  time = time - 1;
  if (time == -1) {
    var answer = confirm("Time's up! Want to try again? You correctly flipped " + matched + " of the 8 pairs.")
    if (answer){
      alert("Good luck! Try to finish in time!")
      location.reload()
    }
    else {
      alert("Thanks for playing! See you later!")
      window.close()
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

  if (flipped > 4 && !cardsMatch) {
    startingScore = startingScore - 10;
    document.getElementById("score").innerHTML = "Score: " + startingScore.toString()
  }

  if (matched == 8) {
    if (startingScore < 1550) {
        var answer = confirm("Want to play again?")
        if (answer) {
            alert("Good luck! Try to beat your score of " + startingScore + "!")
            location.reload()
        }
        else {
            alert("Thanks for playing! See you later!")
            window.close()
        }
    }
    else if (startingScore >= 1550 && startingScore <= 1590) {
      var answer = confirm("Want to play a bonus round to have a chance at 1600?")
      if (answer) {
        location.replace("bonusgame.html");
      }
      else {
        alert("Thanks for playing! See you later!")
        window.close()
      }
    }
    else {
      var answer = confirm("Perfect Score! Do you want to try to match it again?")
      if (answer) {
        alert("Good luck! Let's see if you can get another 1600!")
        location.reload()
      }
      else {
        alert("You've proved your excellent memory! Thanks for playing, and see you later!")
        window.close()
      }
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
    let randomPosition = Math.floor(Math.random() * 16);
    playingCard.style.order = randomPosition;
  });
})();

playingCards.forEach(playingCard => playingCard.addEventListener('click', flipCard));