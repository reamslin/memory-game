let gameContainer = document.getElementById("game");
const startButton = document.querySelector('#start');
const h1 = document.querySelector('h1')
const amountElement = document.querySelector('#amount');
const amountText = document.querySelector('#amount-text');
let shuffledColors; // to hold array of colors
let wait = false // determines if you need to wait for cards to flip back over
let otherCard = false; // determines if a card is already flipped over
let score = 0; // score keeper
let scoreElement; // will hold score element when created

// buildColors: int -> [color]
function buildColors(n) {
  let COLORS = []; // color array starts empty
  // loop n/2 times because each color needs a pair.
  for (let i = 0; i < n/2; i++) {
    // generate random color
    color = `rgb(${Math.floor(Math.random() * 255)},
                 ${Math.floor(Math.random() * 255)},
                 ${Math.floor(Math.random() * 255)})`
    // add two copies of the color to the color array
    COLORS.push(color, color);
  }
  // shuffle the color array
  shuffledColors = shuffle(COLORS);
  // return  
  return shuffledColors;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.setAttribute("data-color", color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}
// *** holy ugly ***
// creates dashboard: contains score display, restart button and newboard button
function createDashboard () {
  let dashboardElement = document.createElement('div');
  dashboardElement.id = 'dashboard';
  dashboardElement.innerHTML = 'SCORE: <span id="score">0</span> <br>';
  document.body.insertBefore(dashboardElement, gameContainer);
  scoreElement = document.querySelector('#score');
  let restartButton = document.createElement('button');
  restartButton.innerText = "RESTART";
  let newboardButton = document.createElement('button');
  newboardButton.innerText = "NEW BOARD";
  newboardButton.addEventListener("click", function() {
    location.reload();
  });
  restartButton.addEventListener("click", restartButtonPressed);
  dashboardElement.append(restartButton);
  dashboardElement.append(newboardButton);
}

// start button: initialize board and create dashboard
function startButtonPressed (e) {
  // remove start menu
  e.target.parentElement.remove();
  // create random colors
  gameContainer = document.createElement("div");
  gameContainer.id = "game";
  shuffledColors = buildColors(parseInt(amountText.innerText))
  // initialize cards for colors
  createDivsForColors(shuffledColors);
  document.body.appendChild(gameContainer);
  // create dashboard
  createDashboard();
}

// resets current board with same cards
function restartButtonPressed () {
  // *** not happy with this, maybe loop over cards flipping if necessary instead ***
  gameContainer.remove();
  gameContainer = document.createElement("div");
  gameContainer.id = "game";
  createDivsForColors(shuffledColors);
  document.body.appendChild(gameContainer);
  //reset global variables
  selectedCardElement = false;
  wait = false;
  score = 0;
  //reset score display
  scoreElement.innerText = score;
}

// card click handler
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  let thisCard = event.target;

    // should only run if you dont have to wait and the card you clicked isnt already flipped
if ((wait === false) && !(thisCard.classList.contains("flipped"))) {
    // flip card
    flip(thisCard);
    // Is this the only card flipped?
    if (otherCard == false) {
      // YES: set this card to otherCard 
     otherCard = thisCard;
     }
      // NO: 
    else {
        // Are they different colors?
        if (otherCard.dataset.color !== thisCard.dataset.color) {
         // YES: flip cards and reset otherCard, force user to wait until cards are flipped 
         wait = true;
         setTimeout(function() {
            flip(otherCard);
            flip(thisCard);
            otherCard = false;
            wait = false;
          }, 1000);
        } else {
          // NO: match! reset otherCard
          otherCard = false;
          }
        // add one to score for trying two cards
        score++;
        scoreElement.innerText = score;

      }
  }
}

// *** not happy with this ***
// *** flipped and unflipped only trigger animations ***
// *** guess and check on when to change colors ***
function flip(cardElement) {
  if (cardElement.classList.toggle("flipped")) {
    setTimeout(function() {
      cardElement.style.backgroundImage = "none";
      cardElement.style.backgroundColor = cardElement.dataset.color;
    }, 250)
  } else {
    cardElement.classList.add("unflipped");
    setTimeout(function () {
      cardElement.style.backgroundImage = "radial-gradient(rgb(140,140,140), black)";
    }, 250)
    setTimeout(function () {
      cardElement.classList.remove("unflipped");
    }, 1000)
  }
}

// once the DOM has loaded
startButton.addEventListener('click', startButtonPressed);
amountElement.addEventListener('input', function (e) {
  let amount = e.target.value;
  amountText.innerText = amount;
})