//Create a list that holds all of your cards
 //
let cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb", "fa-leaf", "fa-bomb", "fa-bolt", "fa-bicycle", "fa-paper-plane-o", "fa-cube"];

const stars = document.querySelector(".stars");
const moves = document.querySelector(".moves");
const restart = document.querySelector(".restart");
const deck = document.querySelector(".deck");
const winnerModal = document.querySelector("#winner-modal");
const winnerMessage = document.querySelector("#winner-message");
const playAgain = document.querySelector(".playAgain");
const timer = document.querySelector(".timer");

let openCards = [];
let matchedCards = 0;
let moveCounter = 0;
let interval;
let second = 0;
let minute = 0;
let timeStart = false;

function gameStart() {
    stopTimer();
    timeStart = false;
    timer.textContent = "0 minutes 0 seconds"; // Reset visual del tiempo
    
    let shuffledCards = shuffle([...cardList]); // Usar una copia para no alterar el original
    
    const deckListElements = deck.getElementsByTagName("li");
    const deckIconElements = deck.getElementsByTagName("i");

    for (let i = 0; i < cardList.length; i++) {
        deckListElements[i].className = "card"; // Limpia clases match, open, show
        deckIconElements[i].className = "fa " + shuffledCards[i];
    }

    openCards = [];
    matchedCards = 0; // Corregido de 1 a 0
    moveCounter = 0;
    moves.textContent = moveCounter;
    stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

deck.addEventListener("click", function(event) {
    let card = event.target;

    // VALIDACIÓN: Solo actuar si es una carta, no está abierta y no hay ya 2 cartas abiertas
    if (card.classList.contains("card") && 
        !card.classList.contains("open") && 
        !card.classList.contains("match") && 
        openCards.length < 2) {
        
        if (!timeStart) {
            startTimer();
            timeStart = true;
        }

        showSymbol(card);
        addCardOpen(card);

        if (openCards.length === 2) {
            moveCounter++;
            moves.innerText = moveCounter;
            updateStars(); // Función extraída para limpiar el código

            if (openCards[0].innerHTML === openCards[1].innerHTML) {
                matchLock();
                matchedCards++;
                gameOver(); // Comprobar victoria justo después del match
            } else {
                matchFail();
            }
        }
    }
});

function updateStars() {
    if (moveCounter > 22) {
        stars.innerHTML = '<li><i class="fa fa-star"></i></li>';
    } else if (moveCounter > 11) {
        stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
    }
}

function showSymbol(card) {
    card.classList.add("open", "show");
}

function addCardOpen(card) {
    openCards.push(card);
}

function matchLock() {
    openCards[0].classList.add("match");
    openCards[1].classList.add("match");
    openCards[0].classList.remove("open", "show");
    openCards[1].classList.remove("open", "show");
    openCards = [];
}

function matchFail() {
    setTimeout(function() {
        openCards[0].classList.remove("show", "open");
        openCards[1].classList.remove("show", "open");
        openCards = [];
    }, 600);
}

function gameOver() {
    if (matchedCards === 8) {
        stopTimer();
        let finalStars = stars.querySelectorAll(".fa-star").length;
        winnerModal.style.display = "block";
        winnerMessage.textContent = `Won in ${minute} min ${second} sec, with ${moveCounter} moves and ${finalStars} stars!`;
    }
}

function startTimer() {
    interval = setInterval(function() {
        second++;
        if (second === 60) {
            minute++;
            second = 0;
        }
        timer.textContent = minute + " minutes " + second + " seconds";
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    second = 0;
    minute = 0;
}

// Event Listeners corregidos
restart.addEventListener("click", gameStart); 
playAgain.addEventListener("click", function() {
    winnerModal.style.display = "none";
    gameStart();
});

// Inicializar el juego
gameStart();



 
