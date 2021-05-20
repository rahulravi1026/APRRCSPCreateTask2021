let cardFlippedSameTurn = false; //checks if the user clicks the same card twice on the same turn
let boardNotClickable = false; //keeps board locked until boardNotClickable turns true
let firstCardFlipped; //identifies the first card the user flips
let secondCardFlipped; //identifies the second card the user flips
let matched = 0; //keeps track of the number of pairs the user has correctly matched
let flipped = 0; //keeps track of the number of incorrect matches of the user
let time = 23; //time starts at 23 and will make its way down
let secondChance1600 = true; //checks if the user is still in the running for a 1600

const playingCards = document.querySelectorAll('.playing-card'); //list represents all 8 playing cards in the bonus game

document.getElementById("time").innerHTML = "Time: " + time.toString()

function startTimer() {
  alert("You can only get two matches wrong, so there is a bit of luck involved! You have 23 seconds, and good luck!")
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

function flipCard() { //function's purpose is to flip the clicked card as long as the board is clickable and the second card clicked is not the same one as the first one clicked in the same turn
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

  checkIfCardsMatch(); //once both cards are clicked, a function to check if both cards match is called
}

function checkIfCardsMatch() {
  flipped++;

  let cardsMatch = firstCardFlipped.dataset.framework === secondCardFlipped.dataset.framework; //checks if the dataset.framework attribute of both cards is equal (set in the html file)
  cardsMatch ? deactivateCards() : returnCardsOriginal();

  if (cardsMatch) { //if cards match, add 1 to matched and subtract 1 from flipped (subtracting is done because it is not an incorrect match)
    matched++;
    flipped--;
  }

  if (flipped > 2 && !cardsMatch) { //once the user flips more than 2 wrong matches, the bonus game ends (alert shown to either redirect the user to the original game or allow the user to leave the game)
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

  if (matched == 4) { //if the user correctly matches all 4 pairs, the user's score is upgraded to a 1600 (alert shown to redirect the user to the original game or allow the user to leave the game)
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

function deactivateCards() { //cards already clicked will not be triggered by a click
  firstCardFlipped.removeEventListener('click', flipCard);
  secondCardFlipped.removeEventListener('click', flipCard);

  resetForNextTurn();
}

function returnCardsOriginal() { //if the 2 cards flipped do not match, they are shown for 1.5 seconds, the user cannot click other cards, and after the 1.5 second period, the cards are flipped back to make the images not visible
  boardNotClickable = true;

  setTimeout(() => {
    firstCardFlipped.classList.remove('flip');
    secondCardFlipped.classList.remove('flip');

    resetForNextTurn();
  }, 1500);
}

function resetForNextTurn() { //reset the conditions as to what they were at the start of the game to make the next turn possible
  [cardFlippedSameTurn, boardNotClickable] = [false, false];
  [firstCardFlipped, secondCardFlipped] = [null, null];
}

(function shuffleAllCards() { //for-each loop is used to iterate through the playingCards list and assign each one with a random position
  playingCards.forEach(playingCard => {
    let randomPosition = Math.floor(Math.random() * 8);
    playingCard.style.order = randomPosition;
  });
})();

playingCards.forEach(playingCard => playingCard.addEventListener('click', flipCard)); //adds a trigger to each card that clicking on the card should call the flipCard() function
