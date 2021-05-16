let cardFlippedSameTurn = false; //checks if the user clicks the same card twice on the same turn
let boardNotClickable = false; //keeps board locked until boardNotClickable turns true
let firstCardFlipped; //identifies the first card the user flips
let secondCardFlipped; //identifies the second card the user flips
let matched = 0; //keeps track of the number of pairs the user has correctly matched
let flipped = 0; //keeps track of the number of incorrect matches of the user
let startingScore = 1600; //keeps track of user's score throughout the match
let time = 0; //time starts at 0 and changes when one of the difficulty buttons are clicked
let difficultyClicked = false; //will turn true when one of the easy, medium, or hard buttons are clicked

const playingCards = document.querySelectorAll('.playing-card'); //list represents all 16 playing cards in the game

document.getElementById("score").innerHTML = "Score: " + startingScore.toString()
document.getElementById("time").innerHTML = "Time: " + time.toString()

function sleep(ms) { //sleep function that allows a delay of a certain number of milliseconds in the program
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startTimer(time) { //main purpose is to start a timer counting down from a certain number of seconds
  playingCards.forEach(playingCard => { //flips all cards so that all images are visible
    playingCard.classList.add('flip');
  });

  sleep(1000).then(() => { //waits for 1 seconds and flips all cards back so that all images are hidden
    playingCards.forEach(playingCard => {
      playingCard.classList.remove('flip');
    });
  });

  difficultyClicked = true; 
  if (time == 81) { //makes the "easy" button permanently purple if 81 is passed in for time
    document.getElementById("easy").style.backgroundColor = "#B99FEB"
  }
  else if (time == 61) { //makes the "medium" button permanently purple if 61 is passed in for time
    document.getElementById("medium").style.backgroundColor = "#B99FEB"
  }
  else if (time == 41) { //makes the "hard" button permanently purple if 41 is passed in for time
    document.getElementById("hard").style.backgroundColor = "#B99FEB"
  }
  setInterval(function() { //executes the code inside setInterval() every 1 second
  time = time - 1; //decreases time by 1
  if (time < 11 && time >= 0) { //check if time is between 0 and 10, inclusive
     var i;
     for(i = 10; i >= 0; i--) { //if so, iterate 10 times and switch the color between red and black every second for the final ten seconds of the game
       document.body.style.backgroundColor = "#AE1F00";
       sleep(500).then(() => {  document.body.style.backgroundColor = "black"; });
    }

  }
 else if(time == -1) { //if time become negative, stop the game by alerting the user that time is up
    alert("Time's up! You correctly flipped " + matched + " of the 8 pairs. Play with another chance!")
    location.reload();
 }

  document.getElementById("time").innerHTML = "Time: " + (time).toString();}, 1000); 
}

function flipCard() { //function's purpose is to flip the clicked card as long as the board is clickable and the second card clicked is not the same one as the first one clicked in the same turn
  if (difficultyClicked == false) {
    return;
  }
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

  if (flipped > 4 && !cardsMatch) { //once the user flips more than 4 wrong matches, 10 points is subtracted each time
    startingScore = startingScore - 10;
    document.getElementById("score").innerHTML = "Score: " + startingScore.toString()
  }

  if (matched == 8) { //once 8 pairs have been successfully matched and the user finishes the game, check for the following possibilities
    if (startingScore < 1550) { //if the final calculated score is less than 1550, give the user an opportunity to play again or leave the game
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
    else if (startingScore >= 1550 && startingScore <= 1590) { //if the final calculated score is between tahn 1550 and 1590, inclusive, give the user an opportunity to play a bonus round to upgrade their score or leave the game
      var answer = confirm("Want to play a bonus round to have a chance at 1600?")
      if (answer) {
        location.replace("bonusgame.html");
      }
      else {
        alert("Thanks for playing! See you later!")
        window.close()
      }
    }
    else { //if the code reaches the "else" condition, the game signifies that the user has won the game by getting 1600 points and congratulates the user (also gives the user an opportunity to play again or leave the game)
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
    let randomPosition = Math.floor(Math.random() * 16);
    playingCard.style.order = randomPosition;
  });
})();

playingCards.forEach(playingCard => playingCard.addEventListener('click', flipCard)); //adds a trigger to each card that clicking on the card should call the flipCard() function
