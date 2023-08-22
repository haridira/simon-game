
// === DATA ===

let gamePattern = [];
let playerPattern = [];

let level = 0;

const clickFlickerTimeOut = 130;
const fadeTime = 110;
let isPatternFlicker = false;

const colorSet = ["red", "blue", "green", "yellow"];

let gameOver = false;
let gameStarted = false;

// == Status Text ==

const statusStart = "Start!";
const statusLost = "Game Over! (Restart)";
const statusLevel = "Level: ";

// == Data Section - Functions ==

// refresh player status for a new round/ level
function refreshPlayerRound() {
    playerPattern = [];
}

// random index to randomly pick from the predefined pallet
function generateRandomIndex() {
    let palletLength = colorSet.length;
    let randomIndex = Math.floor(Math.random()*palletLength);
    return randomIndex;
}

// randomly pick the color from the predefined pallet
function generateRandomColor() {
    let randomColor = "";
    let randomIndex = generateRandomIndex();
    randomColor = colorSet[randomIndex];
    return randomColor;
}

// === CONTROLLER ===

// ## trigger game start

function startGame() {
    gameStarted = true;
    gameOver = false;
    patternAdd();
}

/*
// use keyboard to start game (deactivated)
$(document).keydown((e) => {
    if (e.key === "Control") {
        return;
    }
    if (!gameStarted) {
        startGame();
    }
});
*/

// the cell-phone start button
$("#status").on("click", function() {
    if (gameStarted) {
        return;
    } else {
        flickerOnClick("status");
        startGame();
        $( this ).addClass("no-hover");
    }
});

// set values on start
function onStart() {
    $(".item").addClass("opacity-def");
    level = 0;
    gamePattern = [];
    playerPattern = [];
    gameStarted = false;
    $("#status").removeClass("no-hover");
    renderStatus();
}

// player clicks on one the color buttons
$(".button").on("click", function() {
    if (!gameStarted) {
        return;
    }
    let color = $( this ).attr('id');                           // define the color variable to use it in coming functions
    flickerOnClick(color);                                      // visual effect
    playerPattern.push(color);                                  // add the clicked color to the player pattern

    // update status
    gameOver = isGameOver();

    if (!gameStarted) {
        return;
    } else if (gameOver) {
        console.log("Game over!");                              // TEST LOG
        renderStatus();
        onStart();
    } else if (playerPattern.length === level) {
        refreshPlayerRound();
        patternAdd();
    }

    renderStatus();
});

// function of pattern addition
function patternAdd() {
    let randomColor = generateRandomColor();                    // generate a random color and add it to the game pattern
    gamePattern.push(randomColor);

    setTimeout( () => {
        flashButton(randomColor, clickFlickerTimeOut * 2)
    }, 230);

    // increment level
    level++;

    console.log(`random color is: ${randomColor}`);             // TEST LOG
    renderStatus(level);
}

// update game status - is it fail yet?
function isGameOver() {
    let gameOver = false;
    const index = playerPattern.length - 1;
    if (gamePattern[index] === playerPattern[index]) {
        gameOver = false;
    } else {
        gameOver = true;
    }
    return gameOver;
}

// === VIEW ===

onStart();

// flicker effect
function flashButton(color, waitTime) {
    $(`#${color}`).removeClass("opacity-def");
    $(`#${color}`).addClass("opacity-active");
    $(`#${color}`).addClass("border-click");
    setTimeout( () => {
        $(`#${color}`).removeClass("opacity-active");
        $(`#${color}`).addClass("opacity-def");
        $(`#${color}`).removeClass("border-click");
    }, waitTime);
}
    
function flashMultiple(flickerFunction, color, waitTime, noFlashes) {

    for (i = 0; i < noFlashes * waitTime; i = i + waitTime) {
        setTimeout( () => {
            flickerFunction(color, waitTime / 2)
        } , i);
    }
}
    
function flickerOnClick(color) {
    $(`#${color}`).fadeIn(fadeTime).fadeOut(fadeTime).fadeIn(fadeTime)
}

function renderStatus() {
    if (gameOver) {
        $("#status-text").text(statusLost);
    } else if (gameStarted) {
        $("#status-text").text(statusLevel + level);
    } else {
        $("#status-text").text(statusStart);
    }
}


/*
deprecated: code below is unneeded and kept only for reference on how to use the (e) => function with .on("click")

// onClick but using the event as input to target button id
$(".blue").on("click", (e) => {
    let color = e.target.id;
    logSuccess(color);
    // e.target.innerHTML = "6"
});


// TEST LOG: confirm that the correct button has been clicked
function logSuccess(color) {
    console.log(`Button with the ${color} color just clicked!`);
}

*/
